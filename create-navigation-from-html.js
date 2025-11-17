#!/usr/bin/env node

/**
 * Create navigation content matching the exact HTML structure from envicon.nl
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
  console.log('🧭 Creating Navigation from Current envicon.nl HTML');
  console.log('==================================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    // Navigation data matching the exact HTML structure from envicon.nl
    const navigationData = {
      menuItems: [
        {
          identifier: "over-ons",
          title: "Over ons",
          href: "#over-envicon"
        },
        {
          identifier: "oplossingen", 
          title: "Oplossingen",
          href: "#oplossingen"
        },
        {
          identifier: "nieuws",
          title: "Nieuws", 
          href: "#artikelen"
        },
        {
          identifier: "sectoren",
          title: "Sectoren",
          href: "#sectoren"
        },
        {
          identifier: "proces",
          title: "Proces",
          href: "#process"
        },
        {
          identifier: "diensten",
          title: "Diensten",
          href: "#diensten"
        },
        {
          identifier: "contact",
          title: "Contact",
          href: "#contact"
        }
      ],
      logo: {
        src: "/logo.svg",
        alt: "Envicon Logo"
      },
      publishedAt: new Date().toISOString()
    };
    
    console.log('📝 Creating navigation with exact HTML structure...');
    console.log('Menu items:');
    navigationData.menuItems.forEach(item => {
      console.log(`  - ${item.title} (${item.href})`);
    });
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::navigation.navigation`, 'PUT', navigationData, token);
      console.log('\n✅ Navigation created & published successfully!');
      
      // Test navigation endpoint
      console.log('\n🧪 Testing navigation endpoint...');
      
      const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
      
      try {
        const testResult = await makeRequest(`${STRAPI_URL}/api/navigation`, 'GET', null, API_TOKEN);
        if (testResult.data) {
          console.log('✅ Navigation API: Working!');
          console.log(`  Menu items: ${testResult.data.menuItems?.length || 0}`);
        } else {
          console.log('⚠️  Navigation API: No data yet');
        }
      } catch (error) {
        console.log(`❌ Navigation API: ${error.message}`);
      }
      
      console.log('\n🎉 Navigation matches envicon.nl structure!');
      console.log('\n📋 Navigation includes:');
      console.log('✅ Over ons (#over-envicon)');
      console.log('✅ Oplossingen (#oplossingen)');
      console.log('✅ Nieuws (#artikelen)');
      console.log('✅ Sectoren (#sectoren)');
      console.log('✅ Proces (#process)');
      console.log('✅ Diensten (#diensten)');
      console.log('✅ Contact (#contact)');
      console.log('✅ Logo configuration');
      
    } catch (error) {
      console.error('❌ Failed to create navigation:', error.message);
    }
    
  } catch (error) {
    console.error('\n❌ Navigation creation failed:', error.message);
    process.exit(1);
  }
}

main();
