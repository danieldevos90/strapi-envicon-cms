#!/usr/bin/env node

/**
 * Fix Content Types Registration in Permissions System
 * 
 * This script ensures all content types are properly registered
 * in the Strapi permissions system and visible in the admin panel.
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@envicon.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Envicon2024!Admin';

console.log('🔧 Fixing Content Types Registration in Permissions');
console.log('================================================\n');

async function fixPermissionsRegistration() {
  try {
    console.log('🔐 Logging in as admin...');
    
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
    console.log('📋 Getting public role...');
    const rolesResp = await fetch(`${STRAPI_URL}/users-permissions/roles`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const rolesData = await rolesResp.json();
    const publicRole = rolesData.roles.find(r => r.type === 'public');
    
    if (!publicRole) {
      throw new Error('Public role not found');
    }
    
    console.log('✅ Public role found:', publicRole.id);
    
    // Force regenerate permissions for all content types
    console.log('\n🔄 Regenerating permissions for all content types...');
    
    const permissions = publicRole.permissions || {};
    
    // All content types that should be available
    const contentTypes = {
      // Collection types
      'api::article.article': {
        controllers: {
          article: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::solution.solution': {
        controllers: {
          solution: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::sector.sector': {
        controllers: {
          sector: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::service.service': {
        controllers: {
          service: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::process-step.process-step': {
        controllers: {
          'process-step': {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::project.project': {
        controllers: {
          project: {
            find: { enabled: true },
            findOne: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      // Single types
      'api::homepage.homepage': {
        controllers: {
          homepage: {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::navigation.navigation': {
        controllers: {
          navigation: {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::footer.footer': {
        controllers: {
          footer: {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::envicon-seo-config.envicon-seo-config': {
        controllers: {
          'envicon-seo-config': {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::about-page.about-page': {
        controllers: {
          'about-page': {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      },
      'api::contact-page.contact-page': {
        controllers: {
          'contact-page': {
            find: { enabled: true },
            create: { enabled: false },
            update: { enabled: false },
            delete: { enabled: false }
          }
        }
      }
    };
    
    // Merge with existing permissions
    Object.assign(permissions, contentTypes);
    
    console.log('📝 Updating public role with all content types...');
    
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
    
    console.log('✅ Permissions updated successfully!');
    
    // Test all API endpoints
    console.log('\n🧪 Testing all API endpoints...');
    
    const testEndpoints = [
      '/api/homepage',
      '/api/articles', 
      '/api/sectors',
      '/api/services',
      '/api/solutions',
      '/api/projects',
      '/api/process-steps',
      '/api/about-page',
      '/api/contact-page',
      '/api/navigation',
      '/api/footer',
      '/api/envicon-seo-config'
    ];
    
    let successCount = 0;
    let totalCount = testEndpoints.length;
    
    for (const endpoint of testEndpoints) {
      try {
        const testResp = await fetch(`${STRAPI_URL}${endpoint}`);
        if (testResp.ok) {
          const data = await testResp.json();
          const count = data.data ? (Array.isArray(data.data) ? data.data.length : 1) : 0;
          console.log(`  ✅ ${endpoint}: ${count} items`);
          successCount++;
        } else {
          console.log(`  ⚠️  ${endpoint}: ${testResp.status} ${testResp.statusText}`);
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 API Test Results: ${successCount}/${totalCount} endpoints working`);
    
    if (successCount === totalCount) {
      console.log('🎉 All content types are properly registered and accessible!');
    } else {
      console.log('⚠️  Some endpoints may need content to be populated first.');
      console.log('   Run: STRAPI_API_TOKEN=your_token node populate-content-from-checklist.js');
    }
    
    console.log('\n✅ Content types registration fix completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Check Strapi admin → Settings → Roles → Public');
    console.log('2. Verify all content types are now visible in permissions');
    console.log('3. Populate content if endpoints return empty data');
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    console.log('\n🔧 Manual steps:');
    console.log('1. Restart Strapi: pm2 restart strapi-cms');
    console.log('2. Rebuild: npm run build');
    console.log('3. Check admin panel permissions manually');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  fixPermissionsRegistration();
}

module.exports = { fixPermissionsRegistration };
