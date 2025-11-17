#!/usr/bin/env node

/**
 * Create articles with proper JSON content format
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
  console.log('📰 Creating Articles with JSON Content');
  console.log('=====================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    // Articles with proper JSON content structure (from SQL file)
    const articles = [
      {
        slug: "hoogtepunt-bereikt-in-giessenburg",
        title: "Hoogtepunt bereikt in Giessenburg",
        excerpt: "Afgelopen week bereikten we het hoogste punt van ons project in Giessenburg – een belangrijke mijlpaal in de realisatie van deze tijdelijke huisvesting.",
        author: "Envicon",
        publishedAt: "2025-08-05",
        category: "Projecten",
        content: [
          {
            "type": "paragraph",
            "text": "Afgelopen week bereikten we het hoogste punt van ons project in Giessenburg – een belangrijke mijlpaal in de realisatie van deze tijdelijke huisvesting."
          },
          {
            "type": "paragraph",
            "text": "De demontabele gebouwen staan, de fundering is gereed, en inmiddels is de afbouwfase in volle gang. Er wordt volop gewerkt aan de installaties en verdere inrichting van het terrein."
          },
          {
            "type": "heading",
            "text": "Tijdelijke bouw. Permanente kwaliteit."
          },
          {
            "type": "paragraph",
            "text": "Dit project laat precies zien waar Envicon voor staat: tijdelijke oplossingen realiseren met een permanent kwaliteitsniveau. Door te bouwen met volledig demontabele constructies creëren we duurzame, herbruikbare gebouwen die in korte tijd kunnen worden geplaatst."
          },
          {
            "type": "paragraph",
            "text": "En dat allemaal midden in de bouwvak – dankzij een gedegen voorbereiding, korte lijnen en een sterk team op locatie."
          },
          {
            "type": "paragraph",
            "text": "We kijken uit naar de volgende fase en houden je uiteraard op de hoogte van de afronding en oplevering."
          }
        ]
      },
      {
        slug: "bouw-start-duurzame-demontabele-huisvesting-giessenburg",
        title: "De bouw is van start: duurzame en demontabele huisvesting in Giessenburg",
        excerpt: "Eind deze zomer opent de nieuwe opvanglocatie in Giessenburg in de gemeente Molenlanden voor de opvang van 75 Oekraïense ontheemden.",
        author: "Envicon",
        publishedAt: "2025-07-23",
        category: "Projecten",
        content: [
          {
            "type": "paragraph",
            "text": "Eind deze zomer opent de nieuwe opvanglocatie in Giessenburg in de gemeente Molenlanden voor de opvang van 75 Oekraïense ontheemden. In een tijdsbestek van enkele weken wordt de tijdelijke huisvesting geregeld via de bouw van 24 woningen. De woningen zullen voor een maximale periode van 10 jaar worden bewoond."
          },
          {
            "type": "heading",
            "text": "Snelle operatie"
          },
          {
            "type": "paragraph",
            "text": "Met de uitwerking van het project voorstel en de gunning die volgde (allemaal in een periode van 4 weken), is Envicon gestart met de bouw van de tijdelijke opvanglocatie. In een periode van 6 weken regelt Envicon de terreininrichting, de bouw van de demontabele woningen en faciliteiten, de installatietechniek en de volledige afbouw."
          },
          {
            "type": "paragraph",
            "text": "\"In een stroomversnelling vooruit, dat is waar wij in uitblinken. Ondanks de bouwvak die ook traditioneel tijdens de zomerperiode wordt gehouden zien wij de turn-key oplevering eind deze zomer met het volste vertrouwen tegemoet.\" aldus Kyle Lambert van Envicon."
          },
          {
            "type": "heading",
            "text": "Ontwerp"
          },
          {
            "type": "paragraph",
            "text": "Compact en efficiënt, dat moest het ontwerp zijn. De gebouwen zijn zo gepositioneerd dat er een natuurlijk afscheiding ontstaat. Hierdoor hebben bewoners privacy, maar door de faciliteiten ook de mogelijkheid te ontmoeten en sociaal contact."
          },
          {
            "type": "heading",
            "text": "Demontabele woningen"
          },
          {
            "type": "paragraph",
            "text": "Voor de opvang gebruiken we modulair en demontabel bouwsysteem. Dit betekent dat alle elementen na gebruik weer kunnen worden hergebruikt of verplaatst. Hierdoor beperken we materiaalverspilling tot een minimum."
          }
        ]
      },
      {
        slug: "gemeente-molenlanden-gunt-opdracht-aan-envicon",
        title: "Gemeente Molenlanden gunt opdracht aan Envicon voor tijdelijke huisvesting Oekraïense vluchtelingen",
        excerpt: "Met trots mogen we melden dat Gemeente Molenlanden de opdracht heeft gegund aan Envicon voor het realiseren van tijdelijke huisvesting voor de opvang van Oekraïense vluchtelingen.",
        author: "Envicon",
        publishedAt: "2025-06-27",
        category: "Projecten",
        content: [
          {
            "type": "paragraph",
            "text": "Met trots mogen we melden dat Gemeente Molenlanden de opdracht heeft gegund aan Envicon voor het realiseren van tijdelijke huisvesting voor de opvang van Oekraïense vluchtelingen. Op zeer korte termijn starten wij met de realisatie van 24 woonunits, die naar verwachting eind deze zomer gereed zullen zijn voor tijdelijke bewoning (maximaal 10 jaar). Wij zijn dankbaar voor het vertrouwen voor dit maatschappelijk relevante project."
          },
          {
            "type": "paragraph",
            "text": "Meer weten? Binnenkort delen we meer informatie over de locatie, het ontwerp en het verdere verloop van het project!"
          }
        ]
      }
    ];
    
    let successCount = 0;
    
    for (const article of articles) {
      console.log(`📝 Creating: ${article.title}...`);
      
      try {
        // Add publishedAt timestamp for immediate publication
        const articleWithTimestamp = {
          ...article,
          publishedAt: new Date().toISOString()
        };
        
        const result = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::article.article`, 'POST', articleWithTimestamp, token);
        console.log(`  ✅ Created & published successfully!`);
        successCount++;
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message.split('\n')[0]}`);
      }
    }
    
    // Wait for propagation
    console.log('\n⏳ Waiting for articles to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test articles endpoint
    console.log('\n🧪 Testing articles endpoint...');
    
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    try {
      const result = await makeRequest(`${STRAPI_URL}/api/articles`, 'GET', null, API_TOKEN);
      if (result.data && Array.isArray(result.data)) {
        console.log(`✅ Articles API: ${result.data.length} items`);
        
        result.data.forEach(article => {
          console.log(`  📰 "${article.title}" (${article.category})`);
        });
      } else {
        console.log('⚠️  Articles API: No data yet');
      }
    } catch (error) {
      console.log(`❌ Articles API: ${error.message}`);
    }
    
    console.log('\n🎉 Articles Creation Summary');
    console.log('============================');
    console.log(`📰 Created: ${successCount}/3 articles`);
    console.log('✅ Real Giessenburg project articles');
    console.log('✅ Oekraïense vluchtelingen project coverage');
    console.log('✅ Proper JSON content structure');
    console.log('✅ Published immediately (no drafts)');
    
    if (successCount === 3) {
      console.log('\n🎉 SUCCESS! All articles created from SQL data!');
      console.log('\n📋 Your frontend should now show:');
      console.log('✅ Real project articles');
      console.log('✅ Giessenburg project updates');
      console.log('✅ Company news and updates');
    } else {
      console.log('\n⚠️  Some articles failed - may need manual creation in admin.');
    }
    
  } catch (error) {
    console.error('\n❌ Articles creation failed:', error.message);
    process.exit(1);
  }
}

main();
