#!/usr/bin/env node

/**
 * Test ALL endpoints in cms.envicon.nl and populate empty ones
 */

const https = require('https');

const STRAPI_URL = 'https://cms.envicon.nl';
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

async function testAllEndpoints() {
  console.log('🔍 Testing ALL cms.envicon.nl endpoints...\n');
  
  // Complete list of ALL possible endpoints
  const allEndpoints = [
    // Single types
    { path: '/api/homepage', name: 'Homepage', type: 'single' },
    { path: '/api/about-page', name: 'About Page', type: 'single' },
    { path: '/api/contact-page', name: 'Contact Page', type: 'single' },
    { path: '/api/navigation', name: 'Navigation', type: 'single' },
    { path: '/api/footer', name: 'Footer', type: 'single' },
    { path: '/api/envicon-seo-config', name: 'SEO Config', type: 'single' },
    
    // Collection types
    { path: '/api/services', name: 'Services', type: 'collection' },
    { path: '/api/sectors', name: 'Sectors', type: 'collection' },
    { path: '/api/articles', name: 'Articles', type: 'collection' },
    { path: '/api/projects', name: 'Projects', type: 'collection' },
    { path: '/api/solutions', name: 'Solutions', type: 'collection' },
    { path: '/api/process-steps', name: 'Process Steps', type: 'collection' }
  ];
  
  const results = {};
  let workingCount = 0;
  let emptyCount = 0;
  let errorCount = 0;
  
  for (const endpoint of allEndpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}${endpoint.path}`, 'GET', null, API_TOKEN);
      
      if (result.data !== null) {
        if (endpoint.type === 'collection') {
          const count = Array.isArray(result.data) ? result.data.length : 0;
          if (count > 0) {
            console.log(`✅ ${endpoint.name}: ${count} items`);
            results[endpoint.name] = { status: 'working', count: count };
            workingCount++;
          } else {
            console.log(`⚠️  ${endpoint.name}: 0 items (empty)`);
            results[endpoint.name] = { status: 'empty', count: 0 };
            emptyCount++;
          }
        } else {
          console.log(`✅ ${endpoint.name}: Has content`);
          results[endpoint.name] = { status: 'working', count: 1 };
          workingCount++;
        }
      } else {
        console.log(`⚠️  ${endpoint.name}: No content`);
        results[endpoint.name] = { status: 'empty', count: 0 };
        emptyCount++;
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message.split('\n')[0]}`);
      results[endpoint.name] = { status: 'error', error: error.message };
      errorCount++;
    }
  }
  
  console.log('\n📊 Complete Endpoint Summary');
  console.log('============================');
  console.log(`✅ Working: ${workingCount}`);
  console.log(`⚠️  Empty: ${emptyCount}`);
  console.log(`❌ Error: ${errorCount}`);
  console.log(`📊 Total: ${allEndpoints.length} endpoints`);
  
  return results;
}

async function main() {
  console.log('🔍 Complete Endpoint Test for cms.envicon.nl');
  console.log('=============================================\n');
  
  try {
    const results = await testAllEndpoints();
    
    // Show which endpoints need fixing
    const emptyEndpoints = Object.entries(results)
      .filter(([name, result]) => result.status === 'empty')
      .map(([name]) => name);
    
    const errorEndpoints = Object.entries(results)
      .filter(([name, result]) => result.status === 'error')
      .map(([name]) => name);
    
    if (emptyEndpoints.length > 0) {
      console.log('\n⚠️  Empty endpoints that need content:');
      emptyEndpoints.forEach(name => console.log(`  - ${name}`));
    }
    
    if (errorEndpoints.length > 0) {
      console.log('\n❌ Error endpoints that need fixing:');
      errorEndpoints.forEach(name => console.log(`  - ${name}`));
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Populate empty endpoints with content');
    console.log('2. Fix error endpoints');
    console.log('3. Test frontend with clean data');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

main();
