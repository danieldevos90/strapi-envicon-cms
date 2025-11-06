#!/usr/bin/env node

/**
 * Fix homepage endpoint specifically
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

async function fixHomepage(token) {
  console.log('🏠 Fixing Homepage...');
  
  try {
    // Create homepage with RTF content (Lines 117-297)
    const homepageData = {
      heroTitle: "Specialist in modulair bouwen",
      heroSubtitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
      heroButton1Text: "Meer over modulair bouwen",
      heroButton1Url: "/diensten/modulair-bouwen",
      heroButton2Text: "Vraag een adviesgesprek aan",
      heroButton2Url: "/adviesgesprek",
      // Block 2 - RTF content
      aboutTitle: "Tijdelijke bouw, permanente kwaliteit",
      aboutDescription: "Tijdelijke bouw hoeft niet tijdelijk aan te voelen. Wij ontwikkelen modulaire gebouwen die net zo comfortabel en gebruiksvriendelijk zijn als permanente gebouwen. Wij blijven gedurende het hele bouwproces – en daarna – betrokken.",
      aboutButtonText: "Meer over ons",
      aboutButtonUrl: "/over-ons",
      // Block 3 - RTF content
      demontabelTitle: "Wat betekent demontabel bouwen?",
      demontabelContent: "Demontabel bouwen betekent dat een gebouw is opgebouwd uit losse, herbruikbare onderdelen. De constructie kan eenvoudig worden gedemonteerd, verplaatst en opnieuw opgebouwd op een andere locatie. Zo wordt de levensduur verlengd en verspilling van materialen beperkt.",
      modulairTitle: "Wat betekent modulair bouwen?",
      modulairContent: "Modulair bouwen is een vorm van demontabel bouwen. Modulair bouwen betekent dat een gebouw is opgebouwd uit complete, vooraf geproduceerde modules. De modules komen op de bouwplaats aan als een compleet bouwpakket en worden daar aan elkaar gekoppeld.",
      // Block 4 - RTF content
      sectorsTitle: "Modulaire oplossingen voor wonen, onderwijs, sport en industrie",
      sectorsDescription: "Heb je bijvoorbeeld flexwoningen, noodlokalen, een tijdelijke sporthal, of huisvesting voor arbeidsmigranten nodig? Wij bieden flexibele bouwoplossingen voor elke sector. Onze modulaire gebouwen zijn snel beschikbaar, duurzaam gebouwd en fijn in gebruik.",
      // Meta data from RTF
      metaTitle: "Envicon: modulair bouwen voor elke sector",
      metaDescription: "Specialist in tijdelijk, modulair en demontabel bouwen. Alles geregeld van vergunning tot oplevering.",
      publishedAt: new Date().toISOString()
    };
    
    const result = await makeRequest(`${STRAPI_URL}/content-manager/single-types/api::homepage.homepage`, 'PUT', homepageData, token);
    console.log('✅ Homepage created & published successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to fix homepage:', error.message);
    return null;
  }
}

async function main() {
  console.log('🏠 Fix Homepage Endpoint');
  console.log('========================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    await fixHomepage(token);
    
    // Wait for propagation
    console.log('\n⏳ Waiting for homepage to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test homepage
    console.log('\n🧪 Testing homepage endpoint...');
    
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/api/homepage`, 'GET', null, API_TOKEN);
      if (result.data) {
        console.log('✅ Homepage API: Working!');
        console.log(`  Hero Title: "${result.data.heroTitle}"`);
        console.log(`  Hero Subtitle: "${result.data.heroSubtitle}"`);
      } else {
        console.log('⚠️  Homepage API: No data yet');
      }
    } catch (error) {
      console.log(`❌ Homepage API: ${error.message}`);
    }
    
    console.log('\n🎉 Homepage fix completed!');
    
  } catch (error) {
    console.error('\n❌ Homepage fix failed:', error.message);
    process.exit(1);
  }
}

main();
