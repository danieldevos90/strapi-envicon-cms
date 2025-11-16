/**
 * Test different RichText formats to find what works
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || process.env.CMS_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.argv[2] || process.env.STRAPI_API_TOKEN || '';

async function testRichTextFormats() {
  console.log('🔍 Testing Different RichText Formats');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  if (!API_TOKEN) {
    console.error('❌ ERROR: API Token not provided');
    console.error('Usage: node test-richtext-formats.js YOUR_TOKEN\n');
    process.exit(1);
  }

  const timestamp = Date.now();
  let testNumber = 1;

  // Test 1: Plain string
  console.log(`${testNumber++}. Testing with plain string...`);
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/articles`,
      {
        data: {
          title: `Test Plain String ${timestamp}`,
          slug: `test-plain-${timestamp}`,
          excerpt: 'Test excerpt',
          content: 'Plain text content'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ SUCCESS with plain string!');
    const articleId = response.data?.data?.id || response.data?.data?.documentId;
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
    }
  } catch (error) {
    console.log('❌ FAILED with plain string');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2));
    }
  }
  console.log('');

  // Test 2: Simple HTML
  console.log(`${testNumber++}. Testing with simple HTML...`);
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/articles`,
      {
        data: {
          title: `Test HTML ${timestamp}`,
          slug: `test-html-${timestamp}`,
          excerpt: 'Test excerpt',
          content: '<p>Simple paragraph</p>'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ SUCCESS with HTML!');
    const articleId = response.data?.data?.id || response.data?.data?.documentId;
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
    }
  } catch (error) {
    console.log('❌ FAILED with HTML');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2));
    }
  }
  console.log('');

  // Test 3: RichText JSON format (Strapi v5)
  console.log(`${testNumber++}. Testing with RichText JSON format...`);
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/articles`,
      {
        data: {
          title: `Test RichText JSON ${timestamp}`,
          slug: `test-richtext-json-${timestamp}`,
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
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ SUCCESS with RichText JSON!');
    const articleId = response.data?.data?.id || response.data?.data?.documentId;
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
    }
  } catch (error) {
    console.log('❌ FAILED with RichText JSON');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2));
    }
  }
  console.log('');

  // Test 4: Empty content (should fail if required)
  console.log(`${testNumber++}. Testing with empty content...`);
  try {
    const response = await axios.post(
      `${STRAPI_URL}/api/articles`,
      {
        data: {
          title: `Test Empty ${timestamp}`,
          slug: `test-empty-${timestamp}`,
          excerpt: 'Test excerpt'
          // No content field
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ SUCCESS without content (field is optional)');
    const articleId = response.data?.data?.id || response.data?.data?.documentId;
    if (articleId) {
      await axios.delete(`${STRAPI_URL}/api/articles/${articleId}`, {
        headers: { 'Authorization': `Bearer ${API_TOKEN}` }
      });
    }
  } catch (error) {
    console.log('❌ FAILED without content (field is required)');
    if (error.response) {
      console.log('   Status:', error.response.status);
      console.log('   Error:', JSON.stringify(error.response.data, null, 2));
    }
  }

  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Summary: Check which format worked above');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

testRichTextFormats().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

