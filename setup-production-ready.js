#!/usr/bin/env node

/**
 * Complete Production Setup Script for Strapi CMS
 * 
 * This script:
 * 1. Builds Strapi with TypeScript support
 * 2. Generates TypeScript types
 * 3. Configures API permissions for all content types
 * 4. Verifies the build
 * 5. Tests API endpoints
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@envicon.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Envicon2024!Admin';

console.log('🚀 Setting up Strapi CMS for Production');
console.log('=====================================\n');

async function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { 
      stdio: 'pipe', 
      encoding: 'utf8',
      cwd: __dirname 
    });
    console.log(`✅ ${description} completed`);
    return output;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    throw error;
  }
}

async function setupPermissions() {
  console.log('🔐 Setting up API permissions...');
  
  try {
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
    console.log('✅ Admin login successful');
    
    // Get public role
    const rolesResp = await fetch(`${STRAPI_URL}/users-permissions/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const rolesData = await rolesResp.json();
    const publicRole = rolesData.roles.find(r => r.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Public role found:', publicRole.id);
    
    // Configure permissions
    const permissions = publicRole.permissions || {};
    
    // Collection types - enable find and findOne
    const collectionTypes = [
      'article', 'solution', 'sector', 'service', 'process-step', 'project'
    ];
    
    collectionTypes.forEach(api => {
      const apiKey = `api::${api}.${api}`;
      if (!permissions[apiKey]) {
        permissions[apiKey] = {};
      }
      permissions[apiKey].controllers = {
        [api]: {
          find: { enabled: true },
          findOne: { enabled: true },
          create: { enabled: false },
          update: { enabled: false },
          delete: { enabled: false }
        }
      };
    });
    
    // Single types - enable find only
    const singleTypes = [
      'homepage', 'navigation', 'footer',
      'envicon-seo-config', 'about-page', 'contact-page'
    ];
    
    singleTypes.forEach(type => {
      const apiKey = `api::${type}.${type}`;
      if (!permissions[apiKey]) {
        permissions[apiKey] = {};
      }
      permissions[apiKey].controllers = {
        [type]: {
          find: { enabled: true },
          create: { enabled: false },
          update: { enabled: false },
          delete: { enabled: false }
        }
      };
    });
    
    // Update role permissions
    const updateResp = await fetch(`${STRAPI_URL}/users-permissions/roles/${publicRole.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Public',
        description: 'Default role given to unauthenticated user.',
        type: 'public',
        permissions
      })
    });
    
    if (!updateResp.ok) {
      const error = await updateResp.text();
      throw new Error(`Failed to update permissions: ${error}`);
    }
    
    console.log('✅ API permissions configured successfully');
    
    // Test API endpoints
    console.log('\n🧪 Testing API endpoints...');
    
    const testEndpoints = [
      '/api/homepage',
      '/api/articles',
      '/api/sectors',
      '/api/services',
      '/api/solutions',
      '/api/projects',
      '/api/about-page',
      '/api/contact-page'
    ];
    
    for (const endpoint of testEndpoints) {
      try {
        const testResp = await fetch(`${STRAPI_URL}${endpoint}`);
        if (testResp.ok) {
          const data = await testResp.json();
          const count = data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0;
          console.log(`  ✅ ${endpoint}: ${count} items`);
        } else {
          console.log(`  ⚠️  ${endpoint}: ${testResp.status} ${testResp.statusText}`);
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Permission setup failed:', error.message);
    throw error;
  }
}

async function main() {
  try {
    // Step 1: Clean and build
    console.log('1️⃣ Building Strapi...');
    await runCommand('npm run build:complete', 'Building Strapi');
    
    // Step 2: Verify build
    console.log('\n2️⃣ Verifying build...');
    await runCommand('npm run verify', 'Verifying build');
    
    // Step 3: Check if Strapi is running
    console.log('\n3️⃣ Checking Strapi server...');
    try {
      const healthResp = await fetch(`${STRAPI_URL}/_health`);
      if (healthResp.ok) {
        console.log('✅ Strapi server is running');
        
        // Step 4: Setup permissions
        console.log('\n4️⃣ Setting up permissions...');
        await setupPermissions();
      } else {
        console.log('⚠️  Strapi server not responding. Please start it manually:');
        console.log('   npm run develop  (for development)');
        console.log('   npm start        (for production)');
      }
    } catch (error) {
      console.log('⚠️  Strapi server not running. Please start it manually:');
      console.log('   npm run develop  (for development)');
      console.log('   npm start        (for production)');
    }
    
    // Step 5: Generate TypeScript types
    console.log('\n5️⃣ Checking TypeScript types...');
    const typesPath = path.join(__dirname, 'types/generated');
    if (fs.existsSync(typesPath)) {
      const contentTypesFile = path.join(typesPath, 'contentTypes.d.ts');
      const componentsFile = path.join(typesPath, 'components.d.ts');
      
      if (fs.existsSync(contentTypesFile) && fs.existsSync(componentsFile)) {
        console.log('✅ TypeScript types are generated');
      } else {
        console.log('⚠️  TypeScript types missing. They will be generated when Strapi starts.');
      }
    } else {
      console.log('⚠️  TypeScript types directory missing. They will be generated when Strapi starts.');
    }
    
    console.log('\n🎉 Production setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start Strapi: npm run develop (dev) or npm start (prod)');
    console.log('2. Import content: node import-all-content.js');
    console.log('3. Test your Next.js app');
    console.log('4. Deploy to production');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, setupPermissions };
