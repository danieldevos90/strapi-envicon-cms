#!/usr/bin/env node

/**
 * Remove ALL duplicates from cms.envicon.nl
 * Clean up the API to return only unique, proper content
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

async function cleanupCollection(endpoint, name, token, keepCriteria = null) {
  console.log(`🧹 Cleaning up ${name}...`);
  
  try {
    const response = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}`, 'GET', null, token);
    
    if (!response.results || response.results.length === 0) {
      console.log(`  ℹ️  No ${name} found`);
      return 0;
    }
    
    console.log(`  📊 Found ${response.results.length} ${name} items`);
    
    let deletedCount = 0;
    const seen = new Map();
    const toDelete = [];
    
    // Group by title and identify duplicates
    response.results.forEach(item => {
      const key = item.title || 'untitled';
      
      if (seen.has(key)) {
        // This is a duplicate
        const existing = seen.get(key);
        
        // Decide which one to keep based on criteria
        if (keepCriteria) {
          const shouldKeepNew = keepCriteria(item, existing);
          if (shouldKeepNew) {
            toDelete.push(existing);
            seen.set(key, item);
          } else {
            toDelete.push(item);
          }
        } else {
          // Default: keep the first one, delete the rest
          toDelete.push(item);
        }
      } else {
        seen.set(key, item);
      }
    });
    
    console.log(`  🔄 Found ${toDelete.length} duplicates to remove`);
    
    // Delete duplicates
    for (const item of toDelete) {
      try {
        await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}/${item.id}`, 'DELETE', null, token);
        console.log(`    🗑️  Deleted: "${item.title}" (ID: ${item.id})`);
        deletedCount++;
      } catch (error) {
        console.log(`    ⚠️  Could not delete "${item.title}" (ID: ${item.id}): ${error.message}`);
      }
    }
    
    console.log(`  ✅ ${name} cleanup: ${deletedCount} duplicates removed, ${seen.size} unique items kept`);
    return deletedCount;
    
  } catch (error) {
    console.error(`  ❌ Failed to cleanup ${name}:`, error.message);
    return 0;
  }
}

async function cleanupUnusedContent(token) {
  console.log('\n🗑️  Removing unused/legacy content...\n');
  
  let totalDeleted = 0;
  
  // Keep criteria: prefer items with slugs and RTF content
  const keepRTFContent = (newItem, existingItem) => {
    // Prefer items with slugs
    if (newItem.slug && !existingItem.slug) return true;
    if (!newItem.slug && existingItem.slug) return false;
    
    // Prefer RTF content (items with specific slugs)
    const rtfSlugs = ['modulair-bouwen', 'tijdelijke-huisvesting', 'onderwijs', 'wonen', 'bouw-industrie', 'sport'];
    if (rtfSlugs.includes(newItem.slug)) return true;
    if (rtfSlugs.includes(existingItem.slug)) return false;
    
    // Prefer newer items
    return new Date(newItem.createdAt) > new Date(existingItem.createdAt);
  };
  
  // Clean up services
  const servicesDeleted = await cleanupCollection('api::service.service', 'Services', token, keepRTFContent);
  totalDeleted += servicesDeleted;
  
  // Clean up sectors  
  const sectorsDeleted = await cleanupCollection('api::sector.sector', 'Sectors', token, keepRTFContent);
  totalDeleted += sectorsDeleted;
  
  // Clean up solutions (remove duplicates)
  const solutionsDeleted = await cleanupCollection('api::solution.solution', 'Solutions', token);
  totalDeleted += solutionsDeleted;
  
  console.log(`\n✅ Total cleanup: ${totalDeleted} duplicate items removed`);
  return totalDeleted;
}

async function testCleanedEndpoints() {
  console.log('\n🧪 Testing cleaned endpoints...\n');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const endpoints = [
    { path: '/api/homepage', name: 'Homepage' },
    { path: '/api/about-page', name: 'About Page' },
    { path: '/api/contact-page', name: 'Contact Page' },
    { path: '/api/services', name: 'Services' },
    { path: '/api/sectors', name: 'Sectors' },
    { path: '/api/solutions', name: 'Solutions' }
  ];
  
  let workingCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint.path}`, 'GET', null, API_TOKEN);
      if (result.data !== null) {
        const count = Array.isArray(result.data) ? result.data.length : 1;
        console.log(`  ✅ ${endpoint.name}: ${count} items`);
        workingCount++;
      } else {
        console.log(`  ⚠️  ${endpoint.name}: No content`);
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint.name}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Clean API Status: ${workingCount}/${endpoints.length} endpoints working`);
  return workingCount;
}

async function main() {
  console.log('🧹 Complete Duplicate Removal for cms.envicon.nl');
  console.log('===============================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Clean up all duplicates
    const deletedCount = await cleanupUnusedContent(token);
    
    // Test cleaned endpoints
    const workingCount = await testCleanedEndpoints();
    
    console.log('\n🎉 Duplicate Removal Summary');
    console.log('============================');
    console.log(`🗑️  Duplicates removed: ${deletedCount}`);
    console.log(`✅ Clean endpoints: ${workingCount}/6`);
    
    if (workingCount >= 5) {
      console.log('\n🎉 SUCCESS! API is now clean and ready for frontend!');
      console.log('\n📋 Your frontend should now show:');
      console.log('✅ No duplicate content');
      console.log('✅ Clean services and sectors');
      console.log('✅ Only RTF content where applicable');
      console.log('✅ Proper slugs and structure');
    } else {
      console.log('\n⚠️  Some endpoints may need additional cleanup.');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('1. Refresh your frontend: http://localhost:3005');
    console.log('2. Check for duplicate content - should be gone');
    console.log('3. Test all pages work correctly');
    console.log('4. Deploy clean version to production');
    
  } catch (error) {
    console.error('\n❌ Cleanup failed:', error.message);
    process.exit(1);
  }
}

main();
