/**
 * Enable public access to all content types via admin API
 */

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

async function main() {
  console.log('🔧 Enabling Public API Access');
  console.log('============================\n');
  
  // Login as admin
  console.log('🔐 Logging in...');
  const loginResp = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  
  const loginData = await loginResp.json();
  const token = loginData.data.token;
  console.log('✅ Logged in\n');
  
  // Get public role
  console.log('📋 Getting public role...');
  const rolesResp = await fetch(`${STRAPI_URL}/users-permissions/roles`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const rolesData = await rolesResp.json();
  const publicRole = rolesData.roles.find(r => r.type === 'public');
  console.log('✅ Public role ID:', publicRole.id);
  console.log('');
  
  // Enable all permissions
  console.log('✅ Enabling permissions...');
  
  const permissions = publicRole.permissions || {};
  
  // Enable all API permissions for collection types
  const apis = ['article', 'solution', 'sector', 'service', 'process-step', 'project'];
  apis.forEach(api => {
    if (!permissions[`api::${api}.${api}`]) {
      permissions[`api::${api}.${api}`] = {};
    }
    permissions[`api::${api}.${api}`].controllers = {
      [api]: {
        find: { enabled: true },
        findOne: { enabled: true },
        create: { enabled: false },
        update: { enabled: false },
        delete: { enabled: false }
      }
    };
  });
  
  // Enable single types (pages)
  const singleTypes = ['homepage', 'navigation', 'footer', 'envicon-seo-config', 'about-page', 'contact-page'];
  singleTypes.forEach(type => {
    const apiName = `api::${type}.${type}`;
    if (!permissions[apiName]) {
      permissions[apiName] = {};
    }
    permissions[apiName].controllers = {
      [type]: {
        find: { enabled: true }
      }
    };
  });
  
  // Update role
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
  
  if (updateResp.ok) {
    const result = await updateResp.json();
    console.log('✅ Public permissions enabled!');
    console.log('');
    console.log('Testing API...');
    
    // Test
    const testResp = await fetch(`${STRAPI_URL}/api/articles`);
    const testData = await testResp.json();
    console.log('Articles API:', testData.data ? testData.data.length + ' articles' : 'Still empty');
    
    const solResp = await fetch(`${STRAPI_URL}/api/solutions`);
    const solData = await solResp.json();
    console.log('Solutions API:', solData.data ? solData.data.length + ' solutions' : 'Still empty');
    
  } else {
    const error = await updateResp.text();
    console.error('❌ Failed to update permissions:', error.substring(0, 200));
  }
}

main().catch(console.error);

