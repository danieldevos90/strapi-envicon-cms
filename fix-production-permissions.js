#!/usr/bin/env node

/**
 * Fix permissions for cms.envicon.nl and ensure all content is published
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

async function fixPermissions(token) {
  console.log('🔧 Fixing API permissions...');
  
  try {
    // Get public role
    const rolesResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles`, 'GET', null, token);
    const publicRole = rolesResp.roles.find(r => r.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Public role found:', publicRole.id);
    
    // Configure permissions
    const permissions = publicRole.permissions || {};
    
    // All content types that should be available
    const contentTypes = {
      // Collection types
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
      // Single types
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
    
    // Merge with existing permissions
    Object.assign(permissions, contentTypes);
    
    // Update role permissions
    const updateResp = await makeRequest(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, 'PUT', {
      name: 'Public',
      description: 'Default role given to unauthenticated user.',
      type: 'public',
      permissions
    }, token);
    
    console.log('✅ Permissions updated successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to update permissions:', error.message);
    return false;
  }
}

async function publishContent(token) {
  console.log('📝 Ensuring all content is published...');
  
  try {
    // Get and publish About Page
    try {
      const aboutResp = await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::about-page.about-page`, 'GET', null, token);
      if (aboutResp && !aboutResp.publishedAt) {
        await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::about-page.about-page`, 'PUT', {
          ...aboutResp,
          publishedAt: new Date().toISOString()
        }, token);
        console.log('✅ About Page published');
      }
    } catch (error) {
      console.log('⚠️  About Page: Could not publish -', error.message.split('\n')[0]);
    }

    // Get and publish Contact Page
    try {
      const contactResp = await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::contact-page.contact-page`, 'GET', null, token);
      if (contactResp && !contactResp.publishedAt) {
        await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::contact-page.contact-page`, 'PUT', {
          ...contactResp,
          publishedAt: new Date().toISOString()
        }, token);
        console.log('✅ Contact Page published');
      }
    } catch (error) {
      console.log('⚠️  Contact Page: Could not publish -', error.message.split('\n')[0]);
    }

    return true;
    
  } catch (error) {
    console.error('❌ Failed to publish content:', error.message);
    return false;
  }
}

async function testEndpoints() {
  console.log('🧪 Testing fixed endpoints...');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const testEndpoints = [
    '/api/homepage',
    '/api/about-page',
    '/api/contact-page',
    '/api/services',
    '/api/sectors'
  ];
  
  let workingCount = 0;
  
  for (const endpoint of testEndpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'GET', null, API_TOKEN);
      if (result.data) {
        console.log(`  ✅ ${endpoint}: Working`);
        workingCount++;
      } else {
        console.log(`  ⚠️  ${endpoint}: No data`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint}: ${error.message.split('\n')[0]}`);
    }
  }
  
  console.log(`\n📊 Result: ${workingCount}/${testEndpoints.length} endpoints working`);
  return workingCount;
}

async function main() {
  console.log('🔧 Fixing cms.envicon.nl Permissions & Content');
  console.log('==============================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Fix permissions
    await fixPermissions(token);
    console.log('');
    
    // Publish content
    await publishContent(token);
    console.log('');
    
    // Test endpoints
    const workingCount = await testEndpoints();
    
    if (workingCount >= 4) {
      console.log('\n🎉 Most endpoints are now working!');
    } else {
      console.log('\n⚠️  Some endpoints may need manual attention.');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Check Strapi admin: https://cms.envicon.nl/admin');
    console.log('2. Verify content is published');
    console.log('3. Test your Next.js frontend');
    console.log('4. Add missing projects if needed');
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    process.exit(1);
  }
}

main();
