#!/usr/bin/env node

/**
 * Create all 8 services for homepage diensten section
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
  console.log('🔧 Creating All 8 Services for Homepage Diensten Section');
  console.log('======================================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    // All 8 services from RTF file (Lines 189-233)
    const allServices = [
      {
        slug: "modulair-bouwen",
        title: "Modulair bouwen",
        category: "DIENST",
        description: "Onze modulaire gebouwen zijn voor tijdelijk gebruik, maar bieden permanente kwaliteit. Snel beschikbaar, duurzaam gebouwd en fijn in gebruik.",
        order: 1,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "projectmanagement",
        title: "Projectmanagement",
        category: "DIENST", 
        description: "Vanaf de eerste schets tot de oplevering houden we het overzicht. We plannen, coördineren en bewaken de voortgang, zodat alles volgens afspraak verloopt. Jij hebt één aanspreekpunt en altijd inzicht in wat er speelt.",
        order: 2,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "vergunningen-regelgeving",
        title: "Vergunningen & regelgeving",
        category: "DIENST",
        description: "Vergunningen, regels, normen... wij snappen dat het veel is. Daarom nemen we dit helemaal uit handen. Wij zorgen dat jouw bouwproject verloopt volgens de geldende wet- en regelgeving.",
        order: 3,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "funderingen-grondwerk",
        title: "Funderingen & grondwerk",
        category: "DIENST",
        description: "Van bodemonderzoek tot fundering, wij regelen het complete grondwerk. Wij zorgen dat alles goed is voorbereid, zodat je niet voor verrassingen komt te staan.",
        order: 4,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "ew-installaties",
        title: "E+W-installaties",
        category: "DIENST",
        description: "Verlichting, verwarming, waterinstallaties, wij regelen het allemaal. Onze installaties zijn energiezuinig, veilig en toekomstbestendig.",
        order: 5,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "afbouw-turnkey-oplevering",
        title: "Afbouw & turnkey oplevering",
        category: "DIENST",
        description: "We leveren het gebouw gebruiksklaar op, afgewerkt tot in de details. Geen losse eindjes, maar een compleet gebouw waar je meteen in kunt.",
        order: 6,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "terreininrichting",
        title: "Terreininrichting",
        category: "DIENST",
        description: "We denken verder dan alleen het gebouw. Van bestrating tot groen en verlichting. We zorgen dat het terrein er netjes bij ligt en direct gebruikt kan worden.",
        order: 7,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "buurtmanagement",
        title: "Buurtmanagement",
        category: "DIENST",
        description: "Bouwen heeft ook impact op de omgeving. We houden omwonenden goed op de hoogte, beantwoorden vragen en lossen knelpunten snel op. Zo blijft de omgeving betrokken en verloopt de bouw soepel.",
        order: 8,
        publishedAt: new Date().toISOString()
      }
    ];
    
    let successCount = 0;
    
    console.log('📝 Creating all 8 services for homepage accordions...\n');
    
    for (const service of allServices) {
      console.log(`📝 Creating: ${service.title}...`);
      
      try {
        const result = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, 'POST', service, token);
        console.log(`  ✅ Created & published successfully!`);
        successCount++;
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message.split('\n')[0]}`);
      }
    }
    
    // Wait for propagation
    console.log('\n⏳ Waiting for services to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test services endpoint
    console.log('\n🧪 Testing services endpoint...');
    
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/api/services`, 'GET', null, API_TOKEN);
      if (result.data && Array.isArray(result.data)) {
        console.log(`✅ Services API: ${result.data.length} items`);
        
        console.log('\n📋 Services created:');
        result.data.forEach((service, index) => {
          console.log(`  ${index + 1}. ${service.title}`);
        });
      } else {
        console.log('⚠️  Services API: No data yet');
      }
    } catch (error) {
      console.log(`❌ Services API: ${error.message}`);
    }
    
    console.log('\n🎉 Homepage Services Creation Summary');
    console.log('====================================');
    console.log(`📝 Created: ${successCount}/8 services`);
    
    if (successCount === 8) {
      console.log('\n🎉 SUCCESS! All 8 services created for homepage accordions!');
      console.log('\n📋 Homepage diensten section now has:');
      console.log('✅ Modulair bouwen');
      console.log('✅ Projectmanagement');
      console.log('✅ Vergunningen & regelgeving');
      console.log('✅ Funderingen & grondwerk');
      console.log('✅ E+W-installaties');
      console.log('✅ Afbouw & turnkey oplevering');
      console.log('✅ Terreininrichting');
      console.log('✅ Buurtmanagement');
      
      console.log('\n🚀 Your homepage should now show all 8 service accordions!');
    } else {
      console.log('\n⚠️  Some services failed - may need manual creation in admin.');
    }
    
  } catch (error) {
    console.error('\n❌ Services creation failed:', error.message);
    process.exit(1);
  }
}

main();




