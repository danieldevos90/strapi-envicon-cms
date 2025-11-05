#!/usr/bin/env node

/**
 * Get or create an API token for content population
 */

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

async function getApiToken() {
  try {
    console.log('🔐 Getting API token...');
    
    // Login as admin
    const loginResp = await fetch(`${STRAPI_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    });
    
    if (!loginResp.ok) {
      throw new Error(`Login failed: ${loginResp.status} ${loginResp.statusText}`);
    }
    
    const loginData = await loginResp.json();
    const token = loginData.data.token;
    
    // Get existing API tokens
    const tokensResp = await fetch(`${STRAPI_URL}/admin/api-tokens`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const tokensData = await tokensResp.json();
    
    // Look for existing content token
    const existingToken = tokensData.data?.find(t => t.name === 'content-population');
    
    if (existingToken) {
      console.log('✅ Found existing API token');
      // We can't get the actual token value from existing tokens
      console.log('⚠️  Please use the existing token or create a new one in Strapi admin');
      console.log('   Go to: Settings → API Tokens → Create new token');
      console.log('   Name: content-population');
      console.log('   Token type: Full access');
      return null;
    }
    
    // Create new API token
    const createTokenResp = await fetch(`${STRAPI_URL}/admin/api-tokens`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'content-population',
        description: 'Token for populating content from scripts',
        type: 'full-access',
        lifespan: null // No expiration
      })
    });
    
    if (!createTokenResp.ok) {
      const error = await createTokenResp.text();
      throw new Error(`Failed to create API token: ${error}`);
    }
    
    const tokenData = await createTokenResp.json();
    const apiToken = tokenData.data.accessKey;
    
    console.log('✅ Created new API token');
    console.log('\n🔑 Your API token:');
    console.log(apiToken);
    console.log('\n📋 To use it, run:');
    console.log(`STRAPI_API_TOKEN=${apiToken} node populate-content-from-checklist.js`);
    
    return apiToken;
    
  } catch (error) {
    console.error('❌ Failed to get API token:', error.message);
    console.log('\n📋 Manual steps:');
    console.log('1. Go to Strapi admin: http://localhost:1337/admin');
    console.log('2. Login with admin@envicon.nl / Envicon2024!Admin');
    console.log('3. Go to Settings → API Tokens');
    console.log('4. Create new token with Full Access');
    console.log('5. Copy the token and run:');
    console.log('   STRAPI_API_TOKEN=your_token node populate-content-from-checklist.js');
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  getApiToken();
}

module.exports = { getApiToken };
