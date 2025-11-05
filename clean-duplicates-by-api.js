#!/usr/bin/env node

/**
 * Clean duplicates by getting actual IDs from API and removing them
 */

const https = require('https');

const STRAPI_URL = 'https://cms.envicon.nl';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';
const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';

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

async function cleanDuplicatesByAPI(endpoint, name, token) {
  console.log(`🧹 Cleaning ${name} duplicates via API...`);
  
  try {
    // Get data from public API (this shows what the frontend sees)
    const apiData = await makeRequest(`${STRAPI_URL}/api/${endpoint}`, 'GET', null, API_TOKEN);
    
    if (!apiData.data || apiData.data.length === 0) {
      console.log(`  ℹ️  No ${name} data in API`);
      return 0;
    }
    
    console.log(`  📊 API shows ${apiData.data.length} ${name} items`);
    
    // Group by title to find duplicates
    const titleGroups = {};
    apiData.data.forEach(item => {
      const title = item.title || 'untitled';
      if (!titleGroups[title]) {
        titleGroups[title] = [];
      }
      titleGroups[title].push(item);
    });
    
    let deletedCount = 0;
    
    // Delete duplicates (keep first, delete rest)
    for (const [title, items] of Object.entries(titleGroups)) {
      if (items.length > 1) {
        console.log(`  🔄 "${title}": ${items.length} duplicates found`);
        
        // Keep the first item, delete the rest
        for (let i = 1; i < items.length; i++) {
          const item = items[i];
          try {
            await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::${endpoint}.${endpoint}/${item.id}`, 'DELETE', null, token);
            console.log(`    🗑️  Deleted: "${title}" (ID: ${item.id})`);
            deletedCount++;
          } catch (error) {
            console.log(`    ⚠️  Could not delete ID ${item.id}: ${error.message.split('\n')[0]}`);
          }
        }
      }
    }
    
    console.log(`  ✅ ${name}: ${deletedCount} duplicates removed`);
    return deletedCount;
    
  } catch (error) {
    console.error(`  ❌ Failed to clean ${name}:`, error.message);
    return 0;
  }
}

async function testCleanResults() {
  console.log('\n🧪 Testing cleaned API results...\n');
  
  const endpoints = ['services', 'sectors', 'solutions'];
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}/api/${endpoint}`, 'GET', null, API_TOKEN);
      if (result.data) {
        const titles = result.data.map(item => item.title);
        const uniqueTitles = [...new Set(titles)];
        const duplicateCount = titles.length - uniqueTitles.length;
        
        console.log(`✅ ${endpoint}: ${result.data.length} items (${duplicateCount} duplicates remaining)`);
        
        if (duplicateCount > 0) {
          const titleCounts = {};
          titles.forEach(title => {
            titleCounts[title] = (titleCounts[title] || 0) + 1;
          });
          
          Object.entries(titleCounts).forEach(([title, count]) => {
            if (count > 1) {
              console.log(`    🔄 "${title}": ${count} times`);
            }
          });
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🗑️  Clean Duplicates via API for cms.envicon.nl');
  console.log('===============================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Clean duplicates using API data
    let totalDeleted = 0;
    totalDeleted += await cleanDuplicatesByAPI('service', 'Services', token);
    totalDeleted += await cleanDuplicatesByAPI('sector', 'Sectors', token);
    totalDeleted += await cleanDuplicatesByAPI('solution', 'Solutions', token);
    
    // Test results
    await testCleanResults();
    
    console.log('\n🎉 API Cleanup Summary');
    console.log('======================');
    console.log(`🗑️  Total deleted: ${totalDeleted}`);
    
    if (totalDeleted > 0) {
      console.log('✅ Duplicates removed! Your frontend should now show clean content.');
    } else {
      console.log('⚠️  No items could be deleted. May need manual cleanup in Strapi admin.');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Refresh your frontend: http://localhost:3005');
    console.log('2. Content should no longer appear multiple times');
    console.log('3. If still duplicated, check Strapi admin for manual cleanup');
    
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

main();
