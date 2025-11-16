/**
 * Debug script for article publish action 500 errors
 * 
 * This script investigates why the publish action is failing with a 500 error
 * when trying to publish articles in the Strapi admin panel.
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || process.env.CMS_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

async function debugPublishAction() {
  console.log('🔍 Debugging Article Publish Action 500 Error\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  if (!API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN not found in .env');
    console.error('   Please add your API token to test publish actions\n');
    console.error('   You can get an API token from:');
    console.error('   Strapi Admin → Settings → API Tokens → Create new API Token\n');
    return;
  }

  // Test 1: Check article schema and required fields
  console.log('1️⃣ Checking article schema requirements...');
  try {
    const schemaResponse = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'pagination[limit]': 1
      },
      timeout: 10000
    });
    
    console.log('✅ Article API is accessible');
    console.log('');
    
    // Check article schema file
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'src/api/article/content-types/article/schema.json');
    
    if (fs.existsSync(schemaPath)) {
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      console.log('📋 Required fields in article schema:');
      const requiredFields = [];
      Object.entries(schema.attributes || {}).forEach(([field, config]) => {
        if (config.required) {
          requiredFields.push(field);
          console.log(`   - ${field} (${config.type})`);
        }
      });
      console.log('');
      
      if (requiredFields.length === 0) {
        console.log('⚠️  No required fields found in schema');
      }
    } else {
      console.log('⚠️  Could not find schema file');
    }
  } catch (error) {
    console.error('❌ Error checking schema:');
    if (error.response) {
      console.error('   Status:', error.response.status);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }

  // Test 2: Try to create a test article (draft)
  console.log('2️⃣ Testing article creation (draft)...');
  try {
    const testArticle = {
      data: {
        title: 'Test Article - Debug',
        slug: `test-article-debug-${Date.now()}`,
        excerpt: 'This is a test article for debugging publish issues',
        content: '<p>Test content</p>',
        author: 'Debug Script',
        category: 'Test',
        publishedAt: null // Keep as draft
      }
    };

    const createResponse = await axios.post(
      `${STRAPI_URL}/api/articles`,
      testArticle,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const articleId = createResponse.data?.data?.id || createResponse.data?.data?.documentId;
    console.log('✅ Test article created successfully');
    console.log(`   Article ID: ${articleId}`);
    console.log('');

    // Test 3: Try to publish the test article
    console.log('3️⃣ Testing publish action...');
    try {
      const publishResponse = await axios.post(
        `${STRAPI_URL}/api/articles/${articleId}/actions/publish`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      console.log('✅ Publish action succeeded!');
      console.log('   The publish endpoint is working correctly');
      console.log('');

      // Clean up - delete test article
      console.log('4️⃣ Cleaning up test article...');
      try {
        await axios.delete(
          `${STRAPI_URL}/api/articles/${articleId}`,
          {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`
            },
            timeout: 10000
          }
        );
        console.log('✅ Test article deleted');
      } catch (deleteError) {
        console.log('⚠️  Could not delete test article (you may need to delete it manually)');
        console.log(`   Article ID: ${articleId}`);
      }
      console.log('');

    } catch (publishError) {
      console.error('❌ Publish action failed (this is the issue!):');
      if (publishError.response) {
        console.error('   Status:', publishError.response.status);
        console.error('   Status Text:', publishError.response.statusText);
        console.error('   Error Data:', JSON.stringify(publishError.response.data, null, 2));
        
        // Check for specific error messages
        const errorData = publishError.response.data;
        if (errorData?.error) {
          console.error('\n   Error Details:');
          console.error('   Message:', errorData.error.message || 'N/A');
          if (errorData.error.details) {
            console.error('   Details:', JSON.stringify(errorData.error.details, null, 2));
          }
        }
      } else {
        console.error('   Error:', publishError.message);
      }
      console.log('');

      // Clean up - delete test article even if publish failed
      console.log('4️⃣ Cleaning up test article...');
      try {
        await axios.delete(
          `${STRAPI_URL}/api/articles/${articleId}`,
          {
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`
            },
            timeout: 10000
          }
        );
        console.log('✅ Test article deleted');
      } catch (deleteError) {
        console.log('⚠️  Could not delete test article (you may need to delete it manually)');
        console.log(`   Article ID: ${articleId}`);
      }
      console.log('');
    }

  } catch (createError) {
    console.error('❌ Article creation failed:');
    if (createError.response) {
      console.error('   Status:', createError.response.status);
      console.error('   Error Data:', JSON.stringify(createError.response.data, null, 2));
    } else {
      console.error('   Error:', createError.message);
    }
    console.log('');
  }

  // Test 4: Check for existing articles with publish issues
  console.log('5️⃣ Checking for existing articles with publish issues...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'pagination[limit]': 10,
        'populate': '*',
        'sort': 'createdAt:desc'
      },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      },
      timeout: 10000
    });

    const articles = response.data?.data || [];
    const draftArticles = articles.filter(a => {
      const attrs = a.attributes || a;
      return !attrs.publishedAt;
    });

    console.log(`Found ${draftArticles.length} draft articles`);
    if (draftArticles.length > 0) {
      console.log('\n   Draft articles that might have publish issues:');
      draftArticles.slice(0, 5).forEach((article, index) => {
        const attrs = article.attributes || article;
        console.log(`   ${index + 1}. ${attrs.title || 'Untitled'} (ID: ${article.id || article.documentId})`);
      });
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error checking articles:');
    if (error.response) {
      console.error('   Status:', error.response.status);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }

  // Recommendations
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Common Causes of Publish 500 Errors:');
  console.log('');
  console.log('1. Missing required fields:');
  console.log('   - Check that title, slug, excerpt, content, and publishedAt are set');
  console.log('');
  console.log('2. Invalid data format:');
  console.log('   - RichText content might have invalid HTML');
  console.log('   - Date fields might be in wrong format');
  console.log('   - Relationships might be broken');
  console.log('');
  console.log('3. Database constraints:');
  console.log('   - Unique constraint violations (e.g., duplicate slug)');
  console.log('   - Foreign key constraints');
  console.log('   - Check database logs for specific errors');
  console.log('');
  console.log('4. Lifecycle hooks:');
  console.log('   - Check article service/controller for custom hooks');
  console.log('   - Look for errors in beforeCreate, beforeUpdate, etc.');
  console.log('');
  console.log('5. Permissions:');
  console.log('   - Verify API token has publish permissions');
  console.log('   - Check role permissions in Strapi admin');
  console.log('');
  console.log('6. Check Strapi server logs for detailed error messages');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the debug script
debugPublishAction().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

