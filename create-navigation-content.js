#!/usr/bin/env node

/**
 * Create navigation content matching current envicon.nl structure
 */

const https = require('https');

const STRAPI_URL = 'https://cms.envicon.nl';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

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
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}`));
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

async function main() {
  console.log('🧭 Creating Navigation Content');
  console.log('==============================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    // Navigation structure matching current envicon.nl
    const navigationData = {
      menuItems: [
        {
          label: "Home",
          url: "/",
          order: 1,
          isActive: true
        },
        {
          label: "Sectoren",
          url: "/sectoren",
          order: 2,
          isActive: true,
          submenu: [
            {
              label: "Onderwijs",
              url: "/sectoren/onderwijs",
              order: 1
            },
            {
              label: "Wonen", 
              url: "/sectoren/wonen",
              order: 2
            },
            {
              label: "Bouw & Industrie",
              url: "/sectoren/bouw-industrie",
              order: 3
            },
            {
              label: "Sport",
              url: "/sectoren/sport",
              order: 4
            }
          ]
        },
        {
          label: "Diensten",
          url: "/diensten",
          order: 3,
          isActive: true,
          submenu: [
            {
              label: "Modulair bouwen",
              url: "/diensten/modulair-bouwen",
              order: 1
            },
            {
              label: "Tijdelijke huisvesting",
              url: "/diensten/tijdelijke-huisvesting",
              order: 2
            }
          ]
        },
        {
          label: "Projecten",
          url: "/projecten",
          order: 4,
          isActive: true
        },
        {
          label: "Over ons",
          url: "/over-ons",
          order: 5,
          isActive: true
        },
        {
          label: "Nieuws",
          url: "/artikelen",
          order: 6,
          isActive: true
        },
        {
          label: "Contact",
          url: "/contact",
          order: 7,
          isActive: true
        }
      ],
      logo: {
        src: "/logo.svg",
        alt: "Envicon Logo",
        url: "/"
      },
      ctaButton: {
        text: "Offerte aanvragen",
        url: "/offerte-aanvragen",
        style: "primary"
      },
      publishedAt: new Date().toISOString()
    };
    
    console.log('📝 Creating navigation with menu structure...');
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::navigation.navigation`, 'PUT', navigationData, token);
      console.log('✅ Navigation created & published successfully!');
      
      // Test navigation endpoint
      console.log('\n🧪 Testing navigation endpoint...');
      
      const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
      
      try {
        const testResult = await makeRequest(`${STRAPI_URL}/api/navigation`, 'GET', null, API_TOKEN);
        if (testResult.data) {
          console.log('✅ Navigation API: Working!');
          console.log(`  Menu items: ${testResult.data.menuItems?.length || 0}`);
          console.log(`  Logo: ${testResult.data.logo?.alt || 'Not set'}`);
          console.log(`  CTA Button: ${testResult.data.ctaButton?.text || 'Not set'}`);
        } else {
          console.log('⚠️  Navigation API: No data yet');
        }
      } catch (error) {
        console.log(`❌ Navigation API: ${error.message}`);
      }
      
      console.log('\n🎉 Navigation creation completed!');
      console.log('\n📋 Navigation includes:');
      console.log('✅ Home');
      console.log('✅ Sectoren (with 4 submenu items)');
      console.log('✅ Diensten (with 2 submenu items)');
      console.log('✅ Projecten');
      console.log('✅ Over ons');
      console.log('✅ Nieuws');
      console.log('✅ Contact');
      console.log('✅ Logo configuration');
      console.log('✅ CTA Button (Offerte aanvragen)');
      
    } catch (error) {
      console.error('❌ Failed to create navigation:', error.message);
    }
    
  } catch (error) {
    console.error('\n❌ Navigation creation failed:', error.message);
    process.exit(1);
  }
}

main();
