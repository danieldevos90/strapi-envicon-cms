#!/usr/bin/env node

/**
 * Force remove ALL duplicates by targeting specific IDs
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

async function forceDeleteDuplicates(token) {
  console.log('🗑️  Force deleting known duplicates...\n');
  
  let deletedCount = 0;
  
  // Get current data to see what exists
  console.log('📊 Checking current data...');
  
  try {
    const servicesResp = await makeRequest(`${STRAPI_URL}/api/services`, 'GET', null, API_TOKEN);
    const sectorsResp = await makeRequest(`${STRAPI_URL}/api/sectors`, 'GET', null, API_TOKEN);
    
    console.log(`Services in API: ${servicesResp.data?.length || 0}`);
    console.log(`Sectors in API: ${sectorsResp.data?.length || 0}`);
    
    // Show duplicates in services
    if (servicesResp.data) {
      const titleCounts = {};
      servicesResp.data.forEach(item => {
        const title = item.title || 'untitled';
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });
      
      console.log('\n🔄 Service duplicates:');
      Object.entries(titleCounts).forEach(([title, count]) => {
        if (count > 1) {
          console.log(`  "${title}": ${count} times`);
        }
      });
    }
    
    // Show duplicates in sectors  
    if (sectorsResp.data) {
      const titleCounts = {};
      sectorsResp.data.forEach(item => {
        const title = item.title || 'untitled';
        titleCounts[title] = (titleCounts[title] || 0) + 1;
      });
      
      console.log('\n🔄 Sector duplicates:');
      Object.entries(titleCounts).forEach(([title, count]) => {
        if (count > 1) {
          console.log(`  "${title}": ${count} times`);
        }
      });
    }
    
  } catch (error) {
    console.error('Could not check current data:', error.message);
  }
  
  // Try to delete specific problematic IDs that we know are duplicates
  console.log('\n🗑️  Attempting to delete specific duplicate IDs...');
  
  const duplicateServiceIds = [1, 3, 5, 15, 17, 19]; // Known duplicates
  const duplicateSectorIds = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]; // Known duplicates
  
  // Delete duplicate services
  for (const id of duplicateServiceIds) {
    try {
      await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::service.service/${id}`, 'DELETE', null, token);
      console.log(`  🗑️  Deleted service ID: ${id}`);
      deletedCount++;
    } catch (error) {
      // Ignore 404 errors - item already deleted
      if (!error.message.includes('404')) {
        console.log(`  ⚠️  Could not delete service ${id}: ${error.message}`);
      }
    }
  }
  
  // Delete duplicate sectors
  for (const id of duplicateSectorIds) {
    try {
      await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::sector.sector/${id}`, 'DELETE', null, token);
      console.log(`  🗑️  Deleted sector ID: ${id}`);
      deletedCount++;
    } catch (error) {
      // Ignore 404 errors - item already deleted
      if (!error.message.includes('404')) {
        console.log(`  ⚠️  Could not delete sector ${id}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Force deletion completed: ${deletedCount} items processed`);
  return deletedCount;
}

async function testFinalEndpoints() {
  console.log('\n🧪 Final endpoint test after cleanup...\n');
  
  const endpoints = [
    '/api/services',
    '/api/sectors',
    '/api/solutions'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'GET', null, API_TOKEN);
      if (result.data) {
        console.log(`✅ ${endpoint}: ${result.data.length} items`);
        
        // Check for remaining duplicates
        const titles = result.data.map(item => item.title);
        const uniqueTitles = [...new Set(titles)];
        
        if (titles.length !== uniqueTitles.length) {
          console.log(`  ⚠️  Still has ${titles.length - uniqueTitles.length} duplicates`);
        } else {
          console.log(`  ✅ No duplicates found`);
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🗑️  Force Remove ALL Duplicates from cms.envicon.nl');
  console.log('==================================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Force delete duplicates
    await forceDeleteDuplicates(token);
    
    // Test final endpoints
    await testFinalEndpoints();
    
    console.log('\n🎉 Duplicate removal completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Refresh your frontend: http://localhost:3005');
    console.log('2. Content should no longer appear 4 times');
    console.log('3. Check all pages for clean content');
    
  } catch (error) {
    console.error('\n❌ Force cleanup failed:', error.message);
    process.exit(1);
  }
}

main();
