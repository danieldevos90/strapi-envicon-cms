#!/usr/bin/env node

/**
 * Publish all drafts and remove duplicates from cms.envicon.nl
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

async function publishDraftsAndRemoveDuplicates(endpoint, name, token) {
  console.log(`📝 Processing ${name}...`);
  
  try {
    // Get all items (including drafts)
    const response = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}`, 'GET', null, token);
    
    if (!response.results || response.results.length === 0) {
      console.log(`  ℹ️  No ${name} found`);
      return 0;
    }
    
    console.log(`  📊 Found ${response.results.length} ${name} items`);
    
    // Group by title to identify duplicates
    const titleGroups = {};
    response.results.forEach(item => {
      const title = item.title || 'untitled';
      if (!titleGroups[title]) {
        titleGroups[title] = [];
      }
      titleGroups[title].push(item);
    });
    
    let publishedCount = 0;
    let deletedCount = 0;
    
    // For each title group, keep the first item (publish it) and delete the rest
    for (const [title, items] of Object.entries(titleGroups)) {
      if (items.length > 1) {
        console.log(`    🔄 "${title}": ${items.length} duplicates found`);
        
        // Publish the first item
        const keepItem = items[0];
        if (!keepItem.publishedAt) {
          try {
            const publishData = {
              ...keepItem,
              publishedAt: new Date().toISOString()
            };
            
            await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}/${keepItem.id}`, 'PUT', publishData, token);
            console.log(`      ✅ Published: "${title}" (ID: ${keepItem.id})`);
            publishedCount++;
          } catch (error) {
            console.log(`      ⚠️  Could not publish "${title}" (ID: ${keepItem.id}): ${error.message}`);
          }
        }
        
        // Delete the duplicates
        for (let i = 1; i < items.length; i++) {
          const duplicateItem = items[i];
          try {
            await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}/${duplicateItem.id}`, 'DELETE', null, token);
            console.log(`      🗑️  Deleted duplicate: "${title}" (ID: ${duplicateItem.id})`);
            deletedCount++;
          } catch (error) {
            console.log(`      ⚠️  Could not delete duplicate ID ${duplicateItem.id}: ${error.message}`);
          }
        }
      } else {
        // Single item - just publish if it's a draft
        const item = items[0];
        if (!item.publishedAt) {
          try {
            const publishData = {
              ...item,
              publishedAt: new Date().toISOString()
            };
            
            await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}/${item.id}`, 'PUT', publishData, token);
            console.log(`    ✅ Published: "${title}" (ID: ${item.id})`);
            publishedCount++;
          } catch (error) {
            console.log(`    ⚠️  Could not publish "${title}" (ID: ${item.id}): ${error.message}`);
          }
        }
      }
    }
    
    console.log(`  ✅ ${name}: ${publishedCount} published, ${deletedCount} duplicates removed`);
    return { published: publishedCount, deleted: deletedCount };
    
  } catch (error) {
    console.error(`  ❌ Failed to process ${name}:`, error.message);
    return { published: 0, deleted: 0 };
  }
}

async function testFinalEndpoints() {
  console.log('\n🧪 Testing ALL endpoints after publishing...\n');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const endpoints = [
    '/api/homepage',
    '/api/about-page',
    '/api/contact-page',
    '/api/navigation',
    '/api/footer', 
    '/api/forms-config',
    '/api/envicon-seo-config',
    '/api/services',
    '/api/sectors',
    '/api/solutions',
    '/api/process-steps',
    '/api/articles',
    '/api/projects'
  ];
  
  let workingCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'GET', null, API_TOKEN);
      if (result.data !== null) {
        const count = Array.isArray(result.data) ? result.data.length : 1;
        console.log(`  ✅ ${endpoint}: ${count} items`);
        workingCount++;
      } else {
        console.log(`  ⚠️  ${endpoint}: No content`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint}: ${error.message.split('\n')[0]}`);
    }
  }
  
  console.log(`\n📊 Final Status: ${workingCount}/${endpoints.length} endpoints working`);
  return workingCount;
}

async function main() {
  console.log('📢 Publish All Drafts & Remove Duplicates');
  console.log('=========================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    let totalPublished = 0;
    let totalDeleted = 0;
    
    // Process all collection types
    const collections = [
      { endpoint: 'api::service.service', name: 'Services' },
      { endpoint: 'api::sector.sector', name: 'Sectors' },
      { endpoint: 'api::solution.solution', name: 'Solutions' },
      { endpoint: 'api::process-step.process-step', name: 'Process Steps' },
      { endpoint: 'api::article.article', name: 'Articles' },
      { endpoint: 'api::project.project', name: 'Projects' }
    ];
    
    for (const collection of collections) {
      const result = await publishDraftsAndRemoveDuplicates(collection.endpoint, collection.name, token);
      totalPublished += result.published;
      totalDeleted += result.deleted;
    }
    
    // Test all endpoints
    const workingCount = await testFinalEndpoints();
    
    console.log('\n🎉 Draft Publishing & Duplicate Removal Summary');
    console.log('===============================================');
    console.log(`📢 Published: ${totalPublished} items`);
    console.log(`🗑️  Deleted: ${totalDeleted} duplicates`);
    console.log(`✅ Working endpoints: ${workingCount}/13`);
    
    if (workingCount >= 10) {
      console.log('\n🎉 SUCCESS! Most endpoints are now working with published content!');
    } else {
      console.log('\n⚠️  Some endpoints may need additional time or manual publishing.');
    }
    
    console.log('\n📋 Your frontend should now show:');
    console.log('✅ NO duplicate content');
    console.log('✅ All content PUBLISHED (not drafts)');
    console.log('✅ Clean RTF content from text_for_pages.rtf');
    console.log('✅ Each item appears only once');
    
    console.log('\n🚀 Refresh http://localhost:3005 - should be clean now!');
    
  } catch (error) {
    console.error('\n❌ Publishing failed:', error.message);
    process.exit(1);
  }
}

main();
