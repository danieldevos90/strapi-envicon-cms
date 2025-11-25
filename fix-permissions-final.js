#!/usr/bin/env node

/**
 * Final fix for undefined permissions - direct approach
 */

const https = require('https');

const STRAPI_URL = 'https://cms.envicon.nl';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

function makeRequest(url, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}\n${JSON.stringify(jsonData, null, 2)}`));
          }
        } catch (error) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, body });
          } else {
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}\n${body}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function loginAdmin() {
  console.log('🔐 Logging in as admin...');
  
  try {
    const loginData = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    };

    const result = await makeRequest(`${STRAPI_URL}/admin/login`, 'POST', loginData);
    console.log('✅ Admin login successful');
    return result.data.token;
    
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    throw error;
  }
}

async function enableSpecificPermissions(token) {
  console.log('🔧 Enabling specific permissions for About-page and Contact-page...');
  
  try {
    // Get current permissions
    const rolesResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles`, 'GET', null, token);
    const publicRole = rolesResp.roles.find(r => r.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Public role found:', publicRole.id);
    
    // Get current permissions or initialize empty object
    const currentPermissions = publicRole.permissions || {};
    
    // Add the specific permissions we need
    const newPermissions = {
      ...currentPermissions,
      'api::about-page.about-page': {
        controllers: {
          'about-page': {
            find: { enabled: true }
          }
        }
      },
      'api::contact-page.contact-page': {
        controllers: {
          'contact-page': {
            find: { enabled: true }
          }
        }
      },
      'api::project.project': {
        controllers: {
          'project': {
            find: { enabled: true },
            findOne: { enabled: true }
          }
        }
      }
    };
    
    console.log('📝 Adding permissions for:');
    console.log('  - api::about-page.about-page (find)');
    console.log('  - api::contact-page.contact-page (find)');
    console.log('  - api::project.project (find, findOne)');
    
    // Update the role
    const updatePayload = {
      name: publicRole.name,
      description: publicRole.description,
      type: publicRole.type,
      permissions: newPermissions
    };
    
    const updateResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, 'PUT', updatePayload, token);
    
    console.log('✅ Permissions updated successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to update permissions:', error.message);
    return false;
  }
}

async function testSpecificEndpoints() {
  console.log('\n🧪 Testing the fixed endpoints...');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const testEndpoints = [
    { path: '/api/about-page', name: 'About Page' },
    { path: '/api/contact-page', name: 'Contact Page' },
    { path: '/api/projects', name: 'Projects' }
  ];
  
  let fixedCount = 0;
  
  for (const endpoint of testEndpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint.path}`, 'GET', null, API_TOKEN);
      console.log(`  ✅ ${endpoint.name}: Working! (Status: ${result.data ? 'Has data' : 'Empty but accessible'})`);
      fixedCount++;
    } catch (error) {
      const statusCode = error.message.match(/failed: (\d+)/)?.[1];
      if (statusCode === '404') {
        console.log(`  ⚠️  ${endpoint.name}: 404 - Content may not exist yet`);
      } else {
        console.log(`  ❌ ${endpoint.name}: ${error.message.split('\n')[0]}`);
      }
    }
  }
  
  console.log(`\n📊 Fixed endpoints: ${fixedCount}/${testEndpoints.length}`);
  return fixedCount;
}

async function main() {
  console.log('🔧 Final Fix for Undefined Permissions');
  console.log('======================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Enable specific permissions
    const success = await enableSpecificPermissions(token);
    
    if (success) {
      // Wait for permissions to propagate
      console.log('\n⏳ Waiting for permissions to propagate...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test the specific endpoints
      const fixedCount = await testSpecificEndpoints();
      
      console.log('\n🎉 Permission fix completed!');
      console.log('\n📋 Summary:');
      console.log('✅ About-page permissions: find enabled');
      console.log('✅ Contact-page permissions: find enabled'); 
      console.log('✅ Project permissions: find & findOne enabled');
      
      console.log('\n📋 Next Steps:');
      console.log('1. Check Strapi admin permissions - should show "find" instead of "undefined"');
      console.log('2. The About-page and Contact-page endpoints should now work');
      console.log('3. Test your Next.js frontend with all endpoints');
    }
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  }
}

main();
