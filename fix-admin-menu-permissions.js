#!/usr/bin/env node

/**
 * Fix admin permissions for Navigation menu items
 * This script ensures admin users can add/edit menu items in the Strapi admin panel
 */

const https = require('https');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@envicon.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Envicon2024!Admin';

function makeRequest(url, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}\n${JSON.stringify(jsonData, null, 2)}`));
          }
        } catch (error) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, body });
          } else {
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}\n${body}`));
          }
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function loginAdmin() {
  console.log('🔐 Logging in as admin...');
  
  try {
    const loginData = {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    };

    const result = await makeRequest(`${STRAPI_URL}/admin/login`, 'POST', loginData);
    console.log('✅ Admin login successful');
    return result.data.token;
    
  } catch (error) {
    console.error('❌ Admin login failed:', error.message);
    throw error;
  }
}

async function fixAdminPermissions(token) {
  console.log('\n🔧 Fixing admin role permissions for Navigation...');
  
  try {
    // Get all admin roles
    const rolesResp = await makeRequest(`${STRAPI_URL}/admin/roles`, 'GET', null, token);
    const roles = rolesResp.data || [];
    
    console.log(`Found ${roles.length} admin role(s)`);
    
    // Get all permissions
    const permissionsResp = await makeRequest(`${STRAPI_URL}/admin/permissions`, 'GET', null, token);
    const allPermissions = permissionsResp.data || [];
    
    console.log(`Found ${allPermissions.length} permission(s)`);
    
    // Filter permissions for navigation
    const navigationPermissions = allPermissions.filter(p => 
      p.action && p.action.includes('navigation')
    );
    
    console.log(`Found ${navigationPermissions.length} navigation-related permission(s)`);
    
    if (navigationPermissions.length === 0) {
      console.log('⚠️  No navigation permissions found. This might be normal if permissions are auto-generated.');
      console.log('   Checking if navigation content type exists...');
      
      // Try to get content types
      try {
        const contentTypesResp = await makeRequest(`${STRAPI_URL}/content-type-builder/content-types`, 'GET', null, token);
        const contentTypes = contentTypesResp.data || [];
        const navigationType = contentTypes.find(ct => 
          ct.uid === 'api::navigation.navigation' || 
          ct.apiID === 'navigation'
        );
        
        if (navigationType) {
          console.log('✅ Navigation content type exists');
        } else {
          console.log('⚠️  Navigation content type not found in content-type-builder');
        }
      } catch (err) {
        console.log('⚠️  Could not check content types:', err.message);
      }
    }
    
    // Update each admin role to ensure navigation permissions
    for (const role of roles) {
      if (role.code === 'strapi-super-admin') {
        console.log(`\n✅ Role "${role.name}" (Super Admin) - Has all permissions by default`);
        continue;
      }
      
      console.log(`\n🔧 Updating role: "${role.name}" (${role.code})`);
      
      // Get current role permissions
      const rolePermissionsResp = await makeRequest(`${STRAPI_URL}/admin/roles/${role.id}`, 'GET', null, token);
      const roleData = rolePermissionsResp.data || {};
      const currentPermissions = roleData.permissions || [];
      
      console.log(`   Current permissions: ${currentPermissions.length}`);
      
      // Check if navigation permissions exist
      const hasNavigationPerms = currentPermissions.some(p => 
        p.action && p.action.includes('navigation')
      );
      
      if (!hasNavigationPerms) {
        console.log('   ⚠️  No navigation permissions found for this role');
        console.log('   📝 Adding navigation permissions...');
        
        // Get navigation permissions from all permissions
        const navPermsToAdd = allPermissions.filter(p => 
          p.action && (
            p.action.includes('navigation') ||
            p.action.includes('api::navigation')
          )
        );
        
        if (navPermsToAdd.length > 0) {
          // Add navigation permissions to role
          const updatedPermissions = [...currentPermissions, ...navPermsToAdd.map(p => ({
            action: p.action,
            subject: p.subject,
            properties: p.properties || {},
            conditions: p.conditions || []
          }))];
          
          const updatePayload = {
            ...roleData,
            permissions: updatedPermissions
          };
          
          await makeRequest(`${STRAPI_URL}/admin/roles/${role.id}`, 'PUT', updatePayload, token);
          console.log(`   ✅ Added ${navPermsToAdd.length} navigation permission(s)`);
        } else {
          console.log('   ⚠️  Could not find navigation permissions to add');
          console.log('   💡 This might mean permissions are auto-generated. Try the manual fix below.');
        }
      } else {
        console.log('   ✅ Navigation permissions already exist');
      }
    }
    
    console.log('\n✅ Admin permissions check complete!');
    return true;
    
  } catch (error) {
    console.error('❌ Failed to fix admin permissions:', error.message);
    console.error('   Full error:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Fix Admin Menu Item Permissions');
  console.log('=====================================\n');
  console.log('This script fixes admin panel permissions so users can add menu items.');
  console.log('Note: Super Admin users have all permissions by default.\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    
    // Fix admin permissions
    const success = await fixAdminPermissions(token);
    
    if (success) {
      console.log('\n📋 Next Steps:');
      console.log('1. Log into Strapi admin: ' + STRAPI_URL + '/admin');
      console.log('2. Go to Settings → Roles → Administrator');
      console.log('3. Verify that Navigation permissions are enabled');
      console.log('4. If not, manually enable:');
      console.log('   - Navigation → Read');
      console.log('   - Navigation → Update');
      console.log('   - Navigation → Create (if needed)');
      console.log('5. Try adding a menu item again');
      console.log('\n💡 If you still can\'t add menu items:');
      console.log('   - Make sure you are logged in as a Super Admin');
      console.log('   - Or ensure your role has Navigation permissions enabled');
      console.log('   - Check Settings → Roles → [Your Role] → Navigation');
    }
    
  } catch (error) {
    console.error('\n❌ Fix failed:', error.message);
    console.log('\n💡 Manual Fix Instructions:');
    console.log('1. Log into Strapi admin panel');
    console.log('2. Go to Settings → Roles → Administrator (or your role)');
    console.log('3. Find "Navigation" in the permissions list');
    console.log('4. Enable these permissions:');
    console.log('   ✅ Read');
    console.log('   ✅ Update');
    console.log('   ✅ Create (if available)');
    console.log('5. Click "Save"');
    console.log('6. Try adding a menu item again');
    process.exit(1);
  }
}

main();
