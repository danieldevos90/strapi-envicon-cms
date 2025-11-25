/**
 * Debug script for specific article causing 500 errors
 * 
 * This script investigates a specific article by ID and attempts to identify
 * what's causing the 500 error when loading it in the admin panel.
 */

const axios = require('axios');
require('dotenv').config({ path: '.env' });

const STRAPI_URL = process.env.STRAPI_URL || process.env.CMS_URL || 'https://cms.envicon.nl';
const ARTICLE_ID = process.argv[2] || 'djsce4ne3dg12af0yvytiplt';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Article ID can be passed as command line argument or defaults to the problematic one

async function debugSpecificArticle() {
  console.log('🔍 Debugging Specific Article 500 Error\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Article ID: ${ARTICLE_ID}`);
  console.log(`Strapi URL: ${STRAPI_URL}\n`);

  if (!API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN not found in .env');
    console.error('   Please add your API token to debug authenticated endpoints\n');
  }

  // Test 1: Try to fetch the article via API
  console.log('1️⃣ Testing article API endpoint...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles/${ARTICLE_ID}`, {
      params: {
        'populate': '*'
      },
      timeout: 10000,
      headers: API_TOKEN ? {
        'Authorization': `Bearer ${API_TOKEN}`
      } : {}
    });
    
    console.log('✅ Article found via API');
    console.log('   Title:', response.data?.data?.attributes?.title || response.data?.data?.title || 'N/A');
    console.log('   Slug:', response.data?.data?.attributes?.slug || response.data?.data?.slug || 'N/A');
    console.log('   Published:', response.data?.data?.attributes?.publishedAt || response.data?.data?.publishedAt || 'Not published');
    console.log('');
    
    // Check for potential issues
    const article = response.data?.data?.attributes || response.data?.data || {};
    const issues = [];
    
    // Check required fields
    if (!article.title) issues.push('Missing required field: title');
    if (!article.slug) issues.push('Missing required field: slug');
    if (!article.excerpt) issues.push('Missing required field: excerpt');
    if (!article.content) issues.push('Missing required field: content');
    if (!article.publishedAt) issues.push('Missing required field: publishedAt');
    
    // Check for invalid content
    if (article.content && typeof article.content === 'string') {
      // Check for potentially problematic HTML
      if (article.content.includes('<script')) {
        issues.push('Content contains <script> tags (XSS risk)');
      }
      if (article.content.includes('<style')) {
        issues.push('Content contains <style> tags (XSS risk)');
      }
    }
    
    // Check relationships
    if (article.featuredImage) {
      const image = article.featuredImage?.data || article.featuredImage;
      if (!image || (!image.url && !image.attributes?.url)) {
        issues.push('Featured image relationship is broken');
      }
    }
    
    if (issues.length > 0) {
      console.log('⚠️  Potential issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('');
    } else {
      console.log('✅ No obvious data issues found');
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error fetching article via API:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Status Text:', error.response.statusText);
      console.error('   Error Data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 404) {
        console.error('\n   ⚠️  Article not found - it may have been deleted');
      } else if (error.response.status === 500) {
        console.error('\n   ⚠️  500 error matches the admin panel error');
        console.error('   This suggests a server-side issue with this article');
      }
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }

  // Test 2: Try to fetch via admin API (if token provided)
  if (API_TOKEN) {
    console.log('2️⃣ Testing admin API endpoint...');
    try {
      const response = await axios.get(`${STRAPI_URL}/api/articles/${ARTICLE_ID}`, {
        params: {
          'populate': '*'
        },
        timeout: 10000,
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      console.log('✅ Admin API access works');
      console.log('');
    } catch (error) {
      console.error('❌ Admin API error:');
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Error Data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('   Error:', error.message);
      }
      console.log('');
    }
  }

  // Test 3: Check if article exists in list
  console.log('3️⃣ Checking if article appears in articles list...');
  try {
    const response = await axios.get(`${STRAPI_URL}/api/articles`, {
      params: {
        'pagination[limit]': 100,
        'populate': '*'
      },
      timeout: 10000,
      headers: API_TOKEN ? {
        'Authorization': `Bearer ${API_TOKEN}`
      } : {}
    });
    
    const articles = response.data?.data || [];
    const foundArticle = articles.find(a => 
      (a.id === ARTICLE_ID) || 
      (a.documentId === ARTICLE_ID) ||
      (a.attributes?.id === ARTICLE_ID)
    );
    
    if (foundArticle) {
      console.log('✅ Article found in list');
      console.log('   Title:', foundArticle.attributes?.title || foundArticle.title || 'N/A');
    } else {
      console.log('⚠️  Article not found in list');
      console.log('   This might indicate the article is in a draft state or deleted');
    }
    console.log('');
  } catch (error) {
    console.error('❌ Error fetching articles list:');
    if (error.response) {
      console.error('   Status:', error.response.status);
    } else {
      console.error('   Error:', error.message);
    }
    console.log('');
  }

  // Recommendations
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Recommendations:');
  console.log('');
  console.log('1. Check Strapi server logs for detailed error messages');
  console.log('2. Verify database connection and integrity');
  console.log('3. Check if the article has corrupted data or invalid relationships');
  console.log('4. Try to delete and recreate the article if data is corrupted');
  console.log('5. Check for XSS warnings - remove <script> and <style> tags from content');
  console.log('6. Verify all required fields are present and valid');
  console.log('');
  console.log('To fix XSS warnings, update RichText settings in Strapi:');
  console.log('  - Go to Settings > Content-Type Builder > Article > Content field');
  console.log('  - Remove "script" and "style" from allowedTags');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the debug script
debugSpecificArticle().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

