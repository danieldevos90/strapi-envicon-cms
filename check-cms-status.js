/**
 * Quick check of CMS status and potential issues
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || process.env.CMS_URL || 'https://cms.envicon.nl';

async function checkCMSStatus() {
  console.log('🔍 Checking CMS Status');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  // Test 1: Check if CMS is responding
  console.log('1️⃣ Checking if CMS is responding...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      timeout: 5000,
      validateStatus: () => true // Don't throw on any status
    });
    console.log(`✅ CMS is responding (Status: ${response.status})`);
    if (response.status === 200) {
      console.log('   CMS appears to be working');
    } else if (response.status === 401) {
      console.log('   CMS is up but requires authentication (this is normal)');
    } else {
      console.log(`   Unexpected status: ${response.status}`);
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.log('❌ CMS is not responding - might be down or crashed');
      console.log('   Error:', error.message);
    } else {
      console.log('❌ Error connecting to CMS');
      console.log('   Error:', error.message);
    }
  }
  console.log('');

  // Test 2: Check admin panel
  console.log('2️⃣ Checking admin panel...');
  try {
    const response = await axios.get(`${STRAPI_URL}/admin`, {
      timeout: 5000,
      validateStatus: () => true
    });
    console.log(`✅ Admin panel responding (Status: ${response.status})`);
    if (response.status === 200) {
      console.log('   Admin panel is accessible');
    } else if (response.status === 404) {
      console.log('   Admin panel returns 404 - might need rebuild');
    }
  } catch (error) {
    console.log('❌ Cannot access admin panel');
    console.log('   Error:', error.message);
  }
  console.log('');

  // Test 3: Check API health
  console.log('3️⃣ Checking API health...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 5000,
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      console.log('✅ API is working');
    } else if (response.status === 401) {
      console.log('✅ API is responding (needs auth token)');
    } else if (response.status === 500) {
      console.log('❌ API returns 500 error');
      console.log('   This indicates a server-side error');
      if (response.data) {
        console.log('   Error details:', JSON.stringify(response.data, null, 2));
      }
    } else {
      console.log(`⚠️  API returned status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Cannot check API');
    console.log('   Error:', error.message);
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Next Steps:');
  console.log('  1. If CMS is not responding: Check Strapi logs');
  console.log('  2. If 500 errors: Check server logs for details');
  console.log('  3. If admin 404: Run npm run build');
  console.log('  4. If schema issue: Check schema.json syntax');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

checkCMSStatus().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

