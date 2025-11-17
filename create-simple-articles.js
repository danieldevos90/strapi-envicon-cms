#!/usr/bin/env node

/**
 * Create simple articles that match the schema
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
  console.log('📰 Creating Simple Articles');
  console.log('===========================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    // Simple articles that should work with basic schema
    const articles = [
      {
        slug: "hoogtepunt-bereikt-giessenburg",
        title: "Hoogtepunt bereikt in Giessenburg",
        excerpt: "Afgelopen week bereikten we het hoogste punt van ons project in Giessenburg – een belangrijke mijlpaal in de realisatie van deze tijdelijke huisvesting.",
        author: "Envicon",
        category: "Projecten",
        content: "Afgelopen week bereikten we het hoogste punt van ons project in Giessenburg – een belangrijke mijlpaal in de realisatie van deze tijdelijke huisvesting. De demontabele gebouwen staan, de fundering is gereed, en inmiddels is de afbouwfase in volle gang.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "duurzame-huisvesting-giessenburg",
        title: "Duurzame en demontabele huisvesting in Giessenburg",
        excerpt: "Eind deze zomer opent de nieuwe opvanglocatie in Giessenburg in de gemeente Molenlanden voor de opvang van 75 Oekraïense ontheemden.",
        author: "Envicon",
        category: "Projecten",
        content: "Eind deze zomer opent de nieuwe opvanglocatie in Giessenburg in de gemeente Molenlanden voor de opvang van 75 Oekraïense ontheemden. In een tijdsbestek van enkele weken wordt de tijdelijke huisvesting geregeld via de bouw van 24 woningen.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "gemeente-molenlanden-envicon",
        title: "Gemeente Molenlanden gunt opdracht aan Envicon",
        excerpt: "Met trots mogen we melden dat Gemeente Molenlanden de opdracht heeft gegund aan Envicon voor het realiseren van tijdelijke huisvesting.",
        author: "Envicon",
        category: "Projecten",
        content: "Met trots mogen we melden dat Gemeente Molenlanden de opdracht heeft gegund aan Envicon voor het realiseren van tijdelijke huisvesting voor de opvang van Oekraïense vluchtelingen. Op zeer korte termijn starten wij met de realisatie van 24 woonunits.",
        publishedAt: new Date().toISOString()
      }
    ];
    
    let successCount = 0;
    
    for (const article of articles) {
      console.log(`📝 Creating: ${article.title}...`);
      
      try {
        const result = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::article.article`, 'POST', article, token);
        console.log(`  ✅ Created successfully!`);
        successCount++;
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message.split('\n')[0]}`);
      }
    }
    
    // Test articles endpoint
    console.log('\n🧪 Testing articles endpoint...');
    
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/api/articles`, 'GET', null, API_TOKEN);
      if (result.data && Array.isArray(result.data)) {
        console.log(`✅ Articles API: ${result.data.length} items`);
      } else {
        console.log('⚠️  Articles API: No data yet');
      }
    } catch (error) {
      console.log(`❌ Articles API: ${error.message}`);
    }
    
    console.log(`\n📰 Articles created: ${successCount}/3`);
    
  } catch (error) {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  }
}

main();
