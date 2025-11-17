#!/usr/bin/env node

/**
 * Publish all content that was created but not published
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
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}`));
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

async function publishSingleType(endpoint, name, token) {
  console.log(`📝 Publishing ${name}...`);
  
  try {
    // Get current content
    const current = await makeRequest(`${STRAPI_URL}/content-manager/single-types/${endpoint}`, 'GET', null, token);
    
    if (current && !current.publishedAt) {
      // Publish it
      const publishData = {
        ...current,
        publishedAt: new Date().toISOString()
      };
      
      await makeRequest(`${STRAPI_URL}/content-manager/single-types/${endpoint}`, 'PUT', publishData, token);
      console.log(`  ✅ ${name} published successfully!`);
      return true;
    } else if (current && current.publishedAt) {
      console.log(`  ✅ ${name} already published`);
      return true;
    } else {
      console.log(`  ⚠️  ${name} not found`);
      return false;
    }
    
  } catch (error) {
    console.error(`  ❌ Failed to publish ${name}:`, error.message);
    return false;
  }
}

async function publishCollectionItems(endpoint, name, token) {
  console.log(`📝 Publishing ${name}...`);
  
  try {
    // Get all items
    const response = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}`, 'GET', null, token);
    
    if (response.results) {
      let publishedCount = 0;
      
      for (const item of response.results) {
        if (!item.publishedAt) {
          try {
            const publishData = {
              ...item,
              publishedAt: new Date().toISOString()
            };
            
            await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}/${item.id}`, 'PUT', publishData, token);
            publishedCount++;
          } catch (error) {
            console.log(`    ⚠️  Could not publish item ${item.id}: ${error.message}`);
          }
        }
      }
      
      console.log(`  ✅ ${name}: ${publishedCount} items published (${response.results.length - publishedCount} already published)`);
      return publishedCount;
    }
    
    return 0;
    
  } catch (error) {
    console.error(`  ❌ Failed to publish ${name}:`, error.message);
    return 0;
  }
}

async function main() {
  console.log('📢 Publishing All Content for cms.envicon.nl');
  console.log('==============================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    let totalPublished = 0;

    // Publish single types
    console.log('1️⃣ Publishing Single Types');
    const singleTypes = [
      { endpoint: 'api::homepage.homepage', name: 'Homepage' },
      { endpoint: 'api::about-page.about-page', name: 'About Page' },
      { endpoint: 'api::contact-page.contact-page', name: 'Contact Page' },
      { endpoint: 'api::navigation.navigation', name: 'Navigation' },
      { endpoint: 'api::footer.footer', name: 'Footer' },
      { endpoint: 'api::forms-config.forms-config', name: 'Forms Config' },
      { endpoint: 'api::envicon-seo-config.envicon-seo-config', name: 'SEO Config' }
    ];
    
    for (const type of singleTypes) {
      if (await publishSingleType(type.endpoint, type.name, token)) {
        totalPublished++;
      }
    }
    console.log('');

    // Publish collection types
    console.log('2️⃣ Publishing Collection Types');
    const collectionTypes = [
      { endpoint: 'api::service.service', name: 'Services' },
      { endpoint: 'api::sector.sector', name: 'Sectors' },
      { endpoint: 'api::article.article', name: 'Articles' },
      { endpoint: 'api::project.project', name: 'Projects' },
      { endpoint: 'api::solution.solution', name: 'Solutions' },
      { endpoint: 'api::process-step.process-step', name: 'Process Steps' }
    ];
    
    for (const type of collectionTypes) {
      const published = await publishCollectionItems(type.endpoint, type.name, token);
      totalPublished += published;
    }

    console.log('\n🧪 Testing endpoints after publishing...\n');
    
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
        if (result.data !== null) {
          console.log(`  ✅ ${endpoint}: Working!`);
          workingCount++;
        } else {
          console.log(`  ⚠️  ${endpoint}: Still no data`);
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint}: ${error.message}`);
      }
    }

    console.log('\n🎉 Publication Summary');
    console.log('======================');
    console.log(`📢 Total items published: ${totalPublished}`);
    console.log(`✅ Working endpoints: ${workingCount}/${testEndpoints.length}`);
    
    if (workingCount >= 4) {
      console.log('🎉 SUCCESS! Most content is now published and accessible!');
    } else {
      console.log('⚠️  Some content may need manual publication in Strapi admin.');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Check your local frontend: http://localhost:3000/test-cms-connection');
    console.log('2. All endpoints should now work properly');
    console.log('3. Build your frontend with production data');
    
  } catch (error) {
    console.error('\n❌ Publication failed:', error.message);
    process.exit(1);
  }
}

main();
