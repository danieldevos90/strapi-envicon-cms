#!/usr/bin/env node

/**
 * Create complete homepage with all sections populated
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
  console.log('🏠 Create Complete Homepage with All Sections');
  console.log('=============================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    // Complete homepage data with all sections from RTF
    const completeHomepage = {
      // Hero section (RTF Blok 1)
      hero: {
        title: "Specialist in modulair bouwen",
        subtitle: "Tijdelijke bouw, permanente kwaliteit",
        description: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
        button1Text: "Meer over modulair bouwen",
        button1Url: "/diensten/modulair-bouwen",
        button2Text: "Vraag een adviesgesprek aan",
        button2Url: "/adviesgesprek"
      },
      
      // About section (RTF Blok 2)
      about: {
        title: "Tijdelijke bouw, permanente kwaliteit",
        subtitle: "Wij blijven gedurende het hele bouwproces betrokken",
        description: "Tijdelijke bouw hoeft niet tijdelijk aan te voelen. Wij ontwikkelen modulaire gebouwen die net zo comfortabel en gebruiksvriendelijk zijn als permanente gebouwen. Wij blijven gedurende het hele bouwproces – en daarna – betrokken. Ontstaat er tijdens het bouwproces een aanvullende vraag? Dan regelen we dat!",
        features: [
          {
            icon: "speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Snelle communicatie",
            description: "Persoonlijke begeleiding en snelle reacties op al je vragen"
          },
          {
            icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Alles geregeld",
            description: "Van vergunning tot oplevering, wij regelen alles voor je"
          },
          {
            icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Duurzaam bouwen",
            description: "Modulaire gebouwen die herbruikbaar en energiezuinig zijn"
          }
        ]
      },
      
      // Contact section
      contact: {
        title: "Op zoek naar een specialist in modulair bouwen?",
        subtitle: "Neem contact op",
        description: "Wij denken graag met je mee over de beste oplossing voor jouw project.",
        buttonText: "Neem contact op",
        buttonUrl: "/contact"
      },
      
      // Process section (RTF workflow)
      process: {
        title: "Onze werkwijze",
        subtitle: "Bij Envicon weet je altijd waar je aan toe bent",
        description: "We houden de lijnen kort, werken volgens een strakke planning en geven eerlijk advies."
      },
      
      // Solutions section
      solutions: {
        title: "Welke oplossing past bij jouw project?",
        subtitle: "OPLOSSINGEN",
        description: "Onze modulaire bouwoplossingen zijn flexibel inzetbaar voor diverse projecten en sectoren."
      },
      
      // Articles section
      articles: {
        title: "Nieuws en projecten",
        subtitle: "NIEUWSBERICHTEN",
        description: "Lees het laatste nieuws over onze modulaire bouwprojecten door heel Nederland."
      },
      
      // Sectors section
      sectors: {
        title: "Ontdek maatwerk voor jouw sector",
        subtitle: "SECTOREN",
        description: "Modulaire oplossingen voor wonen, onderwijs, sport en industrie. Heb je bijvoorbeeld flexwoningen, noodlokalen, een tijdelijke sporthal, of huisvesting voor arbeidsmigranten nodig? Wij bieden flexibele bouwoplossingen voor elke sector."
      },
      
      // Services section
      services: {
        title: "Volledige ontzorging voor jouw bouwproject",
        subtitle: "DIENSTEN",
        description: "Alles voor je bouwproject onder één dak. Wij regelen alles. Één team, korte lijnen en heldere afspraken."
      },
      
      publishedAt: new Date().toISOString()
    };
    
    console.log('📝 Creating complete homepage with all sections...');
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::homepage.homepage`, 'PUT', completeHomepage, token);
      console.log('✅ Complete homepage created & published!');
      
      // Wait for propagation
      console.log('\n⏳ Waiting for homepage to be available...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test homepage
      console.log('🧪 Testing homepage endpoint...');
      
      const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
      
      try {
        const testResult = await makeRequest(`${STRAPI_URL}/api/homepage`, 'GET', null, API_TOKEN);
        if (testResult.data) {
          console.log('✅ Homepage API: Working!');
          console.log(`  Hero Title: "${testResult.data.hero?.title || 'No hero data'}"`);
          console.log(`  About Title: "${testResult.data.about?.title || 'No about data'}"`);
          console.log(`  Sections: ${Object.keys(testResult.data).length} sections`);
        } else {
          console.log('⚠️  Homepage API: Still no data - may need manual publish');
        }
      } catch (error) {
        console.log(`❌ Homepage API: ${error.message}`);
      }
      
      console.log('\n🎉 Homepage creation completed!');
      console.log('\n📋 Homepage now includes:');
      console.log('✅ Hero section with RTF content');
      console.log('✅ About section with features');
      console.log('✅ Contact section');
      console.log('✅ Process section');
      console.log('✅ Solutions section');
      console.log('✅ Articles section');
      console.log('✅ Sectors section');
      console.log('✅ Services section');
      
    } catch (error) {
      console.error('❌ Failed to create homepage:', error.message);
    }
    
  } catch (error) {
    console.error('\n❌ Homepage creation failed:', error.message);
    process.exit(1);
  }
}

main();
