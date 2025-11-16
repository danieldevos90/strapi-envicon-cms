/**
 * Debug script to investigate 500 errors on article API
 * 
 * This script tests the article API endpoint and provides detailed error information
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

async function debugArticleAPI() {
  console.log('🔍 Debugging Article API 500 Errors\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Test 1: Basic connectivity
  console.log('1️⃣ Testing Strapi connectivity...');
  try {
    const healthCheck = await axios.get(`${STRAPI_URL}/_health`, { timeout: 5000 });
    console.log('✅ Strapi is running and accessible\n');
  } catch (error) {
    console.error('❌ Cannot connect to Strapi:', error.message);
    console.error('   Make sure Strapi is running on', STRAPI_URL);
    return;
  }

  // Test 2: Article endpoint without auth
  console.log('2️⃣ Testing article endpoint (public access)...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'pagination[limit]': 1
      },
      timeout: 10000
    });
    console.log('✅ Article endpoint is accessible');
    console.log('   Response status:', response.status);
    console.log('   Articles found:', response.data?.data?.length || 0);
    console.log('');
  } catch (error) {
    console.error('❌ Article endpoint error:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Status Text:', error.response.statusText);
      console.error('   Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }

  // Test 3: Article endpoint with populate
  console.log('3️⃣ Testing article endpoint with populate...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'pagination[limit]': 1,
        'populate': '*'
      },
      timeout: 10000
    });
    console.log('✅ Article endpoint with populate works');
    console.log('   Response status:', response.status);
    console.log('');
  } catch (error) {
    console.error('❌ Article endpoint with populate error:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }

  // Test 4: Article endpoint with authentication (if token provided)
  if (API_TOKEN) {
    console.log('4️⃣ Testing article endpoint with authentication...');
    try {
      const response = await axios.get(`${STRAPI_URL}/api/articles`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        },
        params: {
          'pagination[limit]': 1,
          'populate': '*'
        },
        timeout: 10000
      });
      console.log('✅ Article endpoint with auth works');
      console.log('   Response status:', response.status);
      console.log('');
    } catch (error) {
      console.error('❌ Article endpoint with auth error:');
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Error Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('   Error:', error.message);
      }
      console.log('');
    }
  } else {
    console.log('4️⃣ Skipping authenticated test (no API token provided)');
    console.log('   Set STRAPI_API_TOKEN in .env to test authenticated endpoints\n');
  }

  // Test 5: Check database connection
  console.log('5️⃣ Checking database connection...');
  try {
    // Try to access a simple endpoint that requires DB
    const response = await axios.get(`${STRAPI_URL}/api/navigation`, { timeout: 5000 });
    console.log('✅ Database connection appears to be working');
    console.log('');
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.error('❌ Database connection issue detected');
      console.error('   This might be causing the 500 errors');
      console.error('   Check your database configuration in .env');
    } else {
      console.log('⚠️  Could not verify database (this might be normal)');
    }
    console.log('');
  }

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Summary:');
  console.log('   - Check the errors above for specific issues');
  console.log('   - If you see 500 errors, check Strapi server logs');
  console.log('   - Verify database connection and permissions');
  console.log('   - Check article content-type schema');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the debug script
debugArticleAPI().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

