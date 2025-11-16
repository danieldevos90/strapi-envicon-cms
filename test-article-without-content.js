/**
 * Test article creation WITHOUT content field
 * To verify if content field is causing the 500 error
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || process.env.CMS_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.argv[2] || process.env.STRAPI_API_TOKEN || '';

async function testWithoutContent() {
  console.log('🔍 Testing Article Creation WITHOUT Content Field');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Strapi URL: ${STRAPI_URL}`);
  console.log(`API Token: ${API_TOKEN ? 'Provided' : 'NOT PROVIDED'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!API_TOKEN) {
    console.error('❌ ERROR: API Token not provided');
    console.error('Usage: node test-article-without-content.js YOUR_TOKEN\n');
    process.exit(1);
  }

  const timestamp = Date.now();

  // Test 1: Try without content field (even though it's required)
  console.log('1️⃣ Testing WITHOUT content field...');
  const articleWithoutContent = {
    data: {
      title: `Test No Content ${timestamp}`,
      slug: `test-no-content-${timestamp}`,
      excerpt: 'Test excerpt without content field'
    }
  };

  try {
    const response1 = await axios.post(
      `${STRAPI_URL}/api/articles`,
      articleWithoutContent,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Article created without content!');
    console.log('Response:', JSON.stringify(response1.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('❌ Failed (expected - content is required)');
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    }
  }
  console.log('');

  // Test 2: Try with minimal content
  console.log('2️⃣ Testing with minimal content (plain text)...');
  const articleMinimalContent = {
    data: {
      title: `Test Minimal Content ${timestamp}`,
      slug: `test-minimal-content-${timestamp}`,
      excerpt: 'Test excerpt',
      content: 'Plain text content'
    }
  };

  try {
    const response2 = await axios.post(
      `${STRAPI_URL}/api/articles`,
      articleMinimalContent,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Article created with plain text content!');
    const articleId = response2.data?.data?.id || response2.data?.data?.documentId;
    console.log('Article ID:', articleId);
    
    // Cleanup
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      console.log('Test article deleted');
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Failed with plain text content');
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    }
  }
  console.log('');

  // Test 3: Try with simple HTML content
  console.log('3️⃣ Testing with simple HTML content...');
  const articleSimpleHTML = {
    data: {
      title: `Test Simple HTML ${timestamp}`,
      slug: `test-simple-html-${timestamp}`,
      excerpt: 'Test excerpt',
      content: '<p>Simple paragraph</p>'
    }
  };

  try {
    const response3 = await axios.post(
      `${STRAPI_URL}/api/articles`,
      articleSimpleHTML,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Article created with simple HTML!');
    const articleId = response3.data?.data?.id || response3.data?.data?.documentId;
    console.log('Article ID:', articleId);
    
    // Cleanup
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      console.log('Test article deleted');
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Failed with simple HTML content');
      console.log('Status:', error.response.status);
      console.log('Full Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
      
      // Check if error mentions content
      const errorStr = JSON.stringify(error.response.data);
      if (errorStr.includes('content') || errorStr.includes('Content')) {
        console.log('');
        console.log('⚠️  Error is related to content field!');
      }
    }
  }
  console.log('');

  // Test 4: Try with RichText format (Strapi v5 format)
  console.log('4️⃣ Testing with RichText format...');
  const articleRichText = {
    data: {
      title: `Test RichText ${timestamp}`,
      slug: `test-richtext-${timestamp}`,
      excerpt: 'Test excerpt',
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Test content in RichText format'
              }
            ]
          }
        ]
      }
    }
  };

  try {
    const response4 = await axios.post(
      `${STRAPI_URL}/api/articles`,
      articleRichText,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Article created with RichText format!');
    const articleId = response4.data?.data?.id || response4.data?.data?.documentId;
    console.log('Article ID:', articleId);
    
    // Cleanup
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
      console.log('Test article deleted');
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Failed with RichText format');
      console.log('Status:', error.response.status);
      console.log('Full Error Response:');
      console.log(JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Summary:');
  console.log('  Tested different content formats to identify the issue');
  console.log('  Check which test succeeded to determine the problem');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testWithoutContent().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

