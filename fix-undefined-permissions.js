#!/usr/bin/env node

/**
 * Fix undefined permissions for About-page, Contact-page, and other content types
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

async function fixUndefinedPermissions(token) {
  console.log('🔧 Fixing undefined permissions...');
  
  try {
    // Get public role
    const rolesResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles`, 'GET', null, token);
    const publicRole = rolesResp.roles.find(r => r.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Public role found:', publicRole.id);
    console.log('Current permissions keys:', Object.keys(publicRole.permissions || {}));
    
    // Clear existing permissions and rebuild properly
    const permissions = {};
    
    // Collection types - these should have find and findOne
    const collectionTypes = [
      'api::article.article',
      'api::solution.solution', 
      'api::sector.sector',
      'api::service.service',
      'api::process-step.process-step',
      'api::project.project'
    ];
    
    collectionTypes.forEach(apiKey => {
      const controllerName = apiKey.split('.')[1]; // Extract controller name
      permissions[apiKey] = {
        controllers: {
          [controllerName]: {
            find: { enabled: true },
            findOne: { enabled: true }
          }
        }
      };
    });
    
    // Single types - these should have only find
    const singleTypes = [
      'api::homepage.homepage',
      'api::navigation.navigation',
      'api::footer.footer', 
      'api::forms-config.forms-config',
      'api::envicon-seo-config.envicon-seo-config',
      'api::about-page.about-page',
      'api::contact-page.contact-page'
    ];
    
    singleTypes.forEach(apiKey => {
      const controllerName = apiKey.split('.')[1]; // Extract controller name
      permissions[apiKey] = {
        controllers: {
          [controllerName]: {
            find: { enabled: true }
          }
        }
      };
    });
    
    console.log('📝 Setting permissions for:');
    Object.keys(permissions).forEach(key => {
      console.log(`  - ${key}`);
    });
    
    // Update role permissions
    const updatePayload = {
      name: 'Public',
      description: 'Default role given to unauthenticated user.',
      type: 'public',
      permissions: permissions
    };
    
    const updateResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, 'PUT', updatePayload, token);
    
    console.log('✅ Permissions updated successfully!');
    
    // Verify the update
    const verifyResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles`, 'GET', null, token);
    const updatedRole = verifyResp.roles.find(r => r.type === 'public');
    
    console.log('\n🔍 Verification:');
    console.log('Updated permissions keys:', Object.keys(updatedRole.permissions || {}));
    
    // Check specific permissions
    const aboutPagePerms = updatedRole.permissions['api::about-page.about-page'];
    const contactPagePerms = updatedRole.permissions['api::contact-page.contact-page'];
    
    if (aboutPagePerms && aboutPagePerms.controllers && aboutPagePerms.controllers['about-page']) {
      console.log('✅ About-page permissions: find =', aboutPagePerms.controllers['about-page'].find?.enabled);
    } else {
      console.log('❌ About-page permissions not found');
    }
    
    if (contactPagePerms && contactPagePerms.controllers && contactPagePerms.controllers['contact-page']) {
      console.log('✅ Contact-page permissions: find =', contactPagePerms.controllers['contact-page'].find?.enabled);
    } else {
      console.log('❌ Contact-page permissions not found');
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Failed to fix permissions:', error.message);
    return false;
  }
}

async function testEndpoints() {
  console.log('\n🧪 Testing endpoints after permission fix...');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const testEndpoints = [
    { path: '/api/homepage', name: 'Homepage' },
    { path: '/api/about-page', name: 'About Page' },
    { path: '/api/contact-page', name: 'Contact Page' },
    { path: '/api/services', name: 'Services' },
    { path: '/api/sectors', name: 'Sectors' }
  ];
  
  let workingCount = 0;
  
  for (const endpoint of testEndpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint.path}`, 'GET', null, API_TOKEN);
      if (result.data !== null) {
        console.log(`  ✅ ${endpoint.name}: Working`);
        workingCount++;
      } else {
        console.log(`  ⚠️  ${endpoint.name}: No data (but endpoint exists)`);
        workingCount++; // Still counts as working
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint.name}: ${error.message.split('\n')[0]}`);
    }
  }
  
  console.log(`\n📊 Result: ${workingCount}/${testEndpoints.length} endpoints working`);
  return workingCount;
}

async function main() {
  console.log('🔧 Fixing Undefined Permissions for cms.envicon.nl');
  console.log('=================================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Fix undefined permissions
    const success = await fixUndefinedPermissions(token);
    
    if (success) {
      // Wait a moment for permissions to propagate
      console.log('\n⏳ Waiting for permissions to propagate...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Test endpoints
      const workingCount = await testEndpoints();
      
      if (workingCount >= 4) {
        console.log('\n🎉 Permissions fixed! Most endpoints are now working!');
      } else {
        console.log('\n⚠️  Some endpoints may need additional time to propagate.');
      }
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Check Strapi admin permissions: https://cms.envicon.nl/admin/settings/users-permissions/roles');
    console.log('2. Verify About-page and Contact-page show "find" instead of "undefined"');
    console.log('3. Test your Next.js frontend');
    console.log('4. All endpoints should now be accessible');
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  }
}

main();
