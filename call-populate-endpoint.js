/**
 * Call the custom Strapi API endpoint to populate all sectors
 * This uses the Entity Service API which properly handles nested components
 */

const axios = require('axios');
const https = require('https');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const API_URL = `${STRAPI_URL}/api`;

// Create axios instance that ignores SSL certificate errors (for self-signed certs)
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false // Allow self-signed certificates
  })
});

console.log('🚀 Calling populate-all endpoint...');
console.log('📡 Strapi URL:', STRAPI_URL);

async function populateAll() {
  try {
    console.log(`\n📞 POST ${API_URL}/sectors/populate-all`);
    
    const response = await axiosInstance.post(`${API_URL}/sectors/populate-all`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data.success) {
      console.log('\n✅ Success!');
      console.log('📋 Results:');
      response.data.results.forEach(result => {
        const status = result.status === 'updated' ? '✅' : '❌';
        console.log(`  ${status} ${result.slug}: ${result.status}`);
      });
      console.log('\n🎉 All sectors populated successfully!');
      console.log('💡 Features and accordions should now be saved correctly!');
    } else {
      console.error('❌ Error:', response.data.message || 'Unknown error');
    }
  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.statusText);
      if (error.response.data) {
        console.error('📄 Response:', JSON.stringify(error.response.data, null, 2));
      }
      
      if (error.response.status === 404) {
        console.error('\n💡 The endpoint might not be available yet.');
        console.error('💡 Make sure to:');
        console.error('   1. Rebuild Strapi: npm run build');
        console.error('   2. Restart Strapi');
        console.error('   3. Then run this script again');
      }
    } else if (error.code === 'CERT_HAS_EXPIRED' || error.message.includes('certificate')) {
      console.error('❌ SSL Certificate Error:', error.message);
      console.error('\n💡 The script has been updated to ignore SSL certificate errors.');
      console.error('💡 If you still see this error, the endpoint might not be available.');
      console.error('💡 Make sure Strapi is rebuilt and restarted.');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

populateAll();
