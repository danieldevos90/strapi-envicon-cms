/**
 * Full Logs Article Test Script
 * 
 * This script tests article creation with full verbose logging
 * to help debug 500 errors in Plesk environment.
 * 
 * Usage: npm run test:article:logs
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || process.env.CMS_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Enable axios request/response logging
const logAxiosRequest = (config) => {
  console.log('\n📤 REQUEST:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Method:', config.method?.toUpperCase());
  console.log('URL:', config.url);
  console.log('Headers:', JSON.stringify(config.headers, null, 2));
  if (config.data) {
    console.log('Body:', JSON.stringify(config.data, null, 2));
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

const logAxiosResponse = (response) => {
  console.log('\n📥 RESPONSE:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Status:', response.status, response.statusText);
  console.log('Headers:', JSON.stringify(response.headers, null, 2));
  console.log('Data:', JSON.stringify(response.data, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

const logAxiosError = (error) => {
  console.log('\n❌ ERROR:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  if (error.response) {
    console.log('Status:', error.response.status, error.response.statusText);
    console.log('Headers:', JSON.stringify(error.response.headers, null, 2));
    console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    console.log('Request Config:', {
      method: error.config?.method,
      url: error.config?.url,
      data: error.config?.data
    });
  } else if (error.request) {
    console.log('No response received');
    console.log('Request:', error.request);
  } else {
    console.log('Error Message:', error.message);
  }
  if (error.stack) {
    console.log('\nStack Trace:');
    console.log(error.stack);
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
};

// Create axios instance with interceptors
const api = axios.create({
  baseURL: STRAPI_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    logAxiosRequest(config);
    return config;
  },
  (error) => {
    logAxiosError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    logAxiosResponse(response);
    return response;
  },
  (error) => {
    logAxiosError(error);
    return Promise.reject(error);
  }
);

async function testArticleCreation() {
  console.log('🔍 Full Logs Article Creation Test');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log(`API Token: ${API_TOKEN ? 'Provided (' + API_TOKEN.substring(0, 20) + '...)' : 'NOT PROVIDED'}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!API_TOKEN) {
    console.error('❌ ERROR: STRAPI_API_TOKEN not found in .env');
    console.error('   Please add your API token to .env file');
    console.error('   Get token from: Strapi Admin → Settings → API Tokens\n');
    process.exit(1);
  }

  const timestamp = Date.now();
  const testArticle = {
    data: {
      title: `Test Article Full Logs ${timestamp}`,
      slug: `test-article-full-logs-${timestamp}`,
      excerpt: 'This is a test article created with full logging enabled',
      content: '<p>Test content for debugging with full logs.</p>',
      author: 'Debug Script',
      category: 'Test'
    }
  };

  try {
    console.log('1️⃣ Testing Strapi Health...');
    try {
      const healthResponse = await api.get('/_health');
      console.log('✅ Strapi is accessible\n');
    } catch (error) {
      console.log('⚠️  Health check failed (may be normal)\n');
    }

    console.log('2️⃣ Testing Article Creation...');
    console.log('Creating article with data:');
    console.log(JSON.stringify(testArticle, null, 2));
    console.log('');

    const createResponse = await api.post('/api/articles', testArticle, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    const articleId = createResponse.data?.data?.id || createResponse.data?.data?.documentId;
    
    if (articleId) {
      console.log('✅ Article created successfully!');
      console.log(`   Article ID: ${articleId}`);
      console.log('');

      // Test 3: Try to publish
      console.log('3️⃣ Testing Publish Action...');
      try {
        const publishResponse = await api.post(
          `/api/articles/${articleId}/actions/publish`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`
            }
          }
        );
        console.log('✅ Publish action succeeded!');
        console.log('');
      } catch (publishError) {
        console.log('❌ Publish action failed');
        console.log('   (This is expected if article is already published)');
        console.log('');
      }

      // Cleanup
      console.log('4️⃣ Cleaning up test article...');
      try {
        await api.delete(`/api/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`
          }
        });
        console.log('✅ Test article deleted');
      } catch (deleteError) {
        console.log('⚠️  Could not delete test article');
        console.log(`   Article ID: ${articleId}`);
        console.log('   You may need to delete it manually');
      }
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Test completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❌ Test failed with error');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('📋 Error Summary:');
    
    if (error.response) {
      console.log(`   Status: ${error.response.status} ${error.response.statusText}`);
      console.log(`   Error Type: ${error.response.data?.error?.name || 'Unknown'}`);
      console.log(`   Error Message: ${error.response.data?.error?.message || 'No message'}`);
      
      if (error.response.data?.error?.details) {
        console.log(`   Details: ${JSON.stringify(error.response.data.error.details, null, 2)}`);
      }
      
      console.log('');
      console.log('📄 Full Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(`   Error: ${error.message}`);
      if (error.stack) {
        console.log('');
        console.log('Stack Trace:');
        console.log(error.stack);
      }
    }
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💡 Next Steps:');
    console.log('   1. Check the error details above');
    console.log('   2. If status is 500, check Strapi server logs');
    console.log('   3. Verify database connection');
    console.log('   4. Check schema configuration');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(1);
  }
}

// Run the test
testArticleCreation().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

