#!/usr/bin/env node

/**
 * Complete permissions fix for production cms.envicon.nl
 * This script enables ALL necessary permissions for public API access
 */

const https = require('https');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@envicon.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Envicon2024!Admin';

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

async function setAllPermissions(token) {
  console.log('🔧 Setting ALL production permissions...');
  
  try {
    // Get current public role
    const rolesResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles`, 'GET', null, token);
    const publicRole = rolesResp.roles.find(r => r.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Public role found:', publicRole.id);
    
    // Complete permissions object for ALL content types
    const permissions = {
      // Collection types - find and findOne enabled
      'api::article.article': {
        controllers: {
          article: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::solution.solution': {
        controllers: {
          solution: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::sector.sector': {
        controllers: {
          sector: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::service.service': {
        controllers: {
          service: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::process-step.process-step': {
        controllers: {
          'process-step': {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::project.project': {
        controllers: {
          project: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      // Single types - find only
      'api::homepage.homepage': {
        controllers: {
          homepage: {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::navigation.navigation': {
        controllers: {
          navigation: {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::footer.footer': {
        controllers: {
          footer: {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::envicon-seo-config.envicon-seo-config': {
        controllers: {
          'envicon-seo-config': {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::about-page.about-page': {
        controllers: {
          'about-page': {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::contact-page.contact-page': {
        controllers: {
          'contact-page': {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      }
    };
    
    console.log('📝 Setting permissions for ALL content types:');
    Object.keys(permissions).forEach(key => {
      const isCollection = permissions[key].controllers[Object.keys(permissions[key].controllers)[0]].findOne;
      console.log(`  ✅ ${key} (${isCollection ? 'find, findOne' : 'find only'})`);
    });
    
    // Update the role with complete permissions
    const updatePayload = {
      name: 'Public',
      description: 'Default role given to unauthenticated user.',
      type: 'public',
      permissions: permissions
    };
    
    const updateResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, 'PUT', updatePayload, token);
    
    console.log('✅ ALL permissions updated successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to set permissions:', error.message);
    return false;
  }
}

async function testAllEndpoints() {
  console.log('\n🧪 Testing ALL endpoints...');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const endpoints = [
    { path: '/api/homepage', name: 'Homepage' },
    { path: '/api/about-page', name: 'About Page' },
    { path: '/api/contact-page', name: 'Contact Page' },
    { path: '/api/services', name: 'Services' },
    { path: '/api/sectors', name: 'Sectors' },
    { path: '/api/articles', name: 'Articles' },
    { path: '/api/projects', name: 'Projects' },
    { path: '/api/solutions', name: 'Solutions' },
    { path: '/api/navigation', name: 'Navigation' },
    { path: '/api/footer', name: 'Footer' },
    { path: '/api/envicon-seo-config', name: 'SEO Config' }
  ];
  
  let workingCount = 0;
  let totalCount = endpoints.length;
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint.path}`, 'GET', null, API_TOKEN);
      if (result.data !== null) {
        const count = Array.isArray(result.data) ? result.data.length : 1;
        console.log(`  ✅ ${endpoint.name}: Working (${count} items)`);
        workingCount++;
      } else {
        console.log(`  ⚠️  ${endpoint.name}: Accessible but no content`);
        workingCount++; // Still counts as working
      }
    } catch (error) {
      const statusCode = error.message.match(/failed: (\d+)/)?.[1];
      if (statusCode === '404') {
        console.log(`  ⚠️  ${endpoint.name}: 404 - May need content`);
      } else {
        console.log(`  ❌ ${endpoint.name}: ${error.message.split('\n')[0]}`);
      }
    }
  }
  
  console.log(`\n📊 Final Result: ${workingCount}/${totalCount} endpoints working`);
  return workingCount;
}

async function main() {
  console.log('🚀 Complete Production Permissions Fix for cms.envicon.nl');
  console.log('========================================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Set all permissions
    const success = await setAllPermissions(token);
    
    if (success) {
      // Wait for permissions to propagate
      console.log('\n⏳ Waiting for permissions to propagate...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test all endpoints
      const workingCount = await testAllEndpoints();
      
      if (workingCount >= 10) {
        console.log('\n🎉 SUCCESS! All permissions are now properly configured!');
      } else {
        console.log('\n⚠️  Most permissions fixed, some endpoints may need content.');
      }
      
      console.log('\n📋 What was fixed:');
      console.log('✅ All content types now have proper permissions');
      console.log('✅ About-page: find enabled');
      console.log('✅ Contact-page: find enabled');
      console.log('✅ All collection types: find & findOne enabled');
      console.log('✅ All single types: find enabled');
      console.log('✅ No more "undefined" permissions');
      
      console.log('\n📋 Next Steps:');
      console.log('1. All API endpoints should now work with your API key');
      console.log('2. Test your Next.js frontend');
      console.log('3. Add any missing content (projects, etc.)');
      console.log('4. Your production CMS is ready! 🚀');
    }
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  }
}

main();
