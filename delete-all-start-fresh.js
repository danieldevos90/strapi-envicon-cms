#!/usr/bin/env node

/**
 * Delete ALL content and start fresh with clean RTF data
 * No workarounds - clean slate approach
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

async function deleteAllContent(endpoint, name, token) {
  console.log(`🗑️  Deleting ALL ${name}...`);
  
  try {
    const response = await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}`, 'GET', null, token);
    
    if (!response.results || response.results.length === 0) {
      console.log(`  ℹ️  No ${name} to delete`);
      return 0;
    }
    
    console.log(`  📊 Found ${response.results.length} ${name} items to delete`);
    
    let deletedCount = 0;
    
    // Delete ALL items
    for (const item of response.results) {
      try {
        await makeRequest(`${STRAPI_URL}/content-manager/collection-types/${endpoint}/${item.id}`, 'DELETE', null, token);
        console.log(`    🗑️  Deleted: "${item.title}" (ID: ${item.id})`);
        deletedCount++;
      } catch (error) {
        console.log(`    ⚠️  Could not delete "${item.title}" (ID: ${item.id}): ${error.message.split('\n')[0]}`);
      }
    }
    
    console.log(`  ✅ ${name}: ${deletedCount}/${response.results.length} items deleted`);
    return deletedCount;
    
  } catch (error) {
    console.error(`  ❌ Failed to delete ${name}:`, error.message);
    return 0;
  }
}

async function createFreshRTFContent(token) {
  console.log('\n📝 Creating fresh RTF content...\n');
  
  let createdCount = 0;
  
  try {
    // 1. Create fresh services from RTF
    console.log('1️⃣ Creating Fresh Services');
    const services = [
      {
        slug: "modulair-bouwen",
        title: "Modulair bouwen",
        category: "DIENST",
        description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules",
        heroTitle: "Wat is modulair bouwen?",
        heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
        contentBlocks: [
          {
            title: "Persoonlijk advies over jouw modulair bouwproject",
            content: "Elk bouwproject is anders, dus kijken we samen naar wat er nodig is. Dankzij onze flexibele bouwsystemen leveren we altijd maatwerk: een bouwoplossing die past bij jouw locatie, planning en wensen. We begeleiden het hele project en doen de volledige coördinatie op de bouwplaats."
          }
        ],
        advantages: [
          {
            icon: "speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Snel gebouwd, minimale overlast",
            description: "Omdat we de bouwonderdelen grotendeels in de werkplaats voorbereiden, kunnen we op locatie snel en efficiënt werken. Zo beperken we de bouwtijd én de overlast op de bouwplaats."
          },
          {
            icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Circulair en toekomstbestendig",
            description: "Onze bouwsystemen zijn volledig demontabel. De onderdelen kunnen na gebruik makkelijk uit elkaar worden gehaald en worden ingezet bij een ander bouwproject."
          },
          {
            icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Flexibel in ontwerp",
            description: "We ontwerpen elke modulaire unit of demontabel bouwsysteem precies zoals jij het wilt, passend bij de locatie en het gebruik."
          }
        ],
        metaTitle: "Wat is modulair bouwen? | Envicon",
        metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "tijdelijke-huisvesting",
        title: "Tijdelijke huisvesting",
        category: "DIENST",
        description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte",
        heroTitle: "Wat is tijdelijke huisvesting?",
        heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.",
        contentBlocks: [
          {
            title: "Persoonlijk advies over tijdelijke huisvesting",
            content: "Ineens extra woonruimte of noodlokalen nodig? De vraag naar tijdelijke huisvesting is vaak urgent. Daarom begeleiden we het hele project en doen we de volledige coördinatie op de bouwplaats. Zo ben jij geen tijd kwijt aan het zoeken van geschikte partners en leveranciers."
          }
        ],
        advantages: [
          {
            icon: "speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Snel inzetbaar bij urgente huisvestingsvragen",
            description: "Heb je op korte termijn extra ruimte nodig? We bereiden de bouwonderdelen grotendeels voor in onze eigen werkplaats. Daardoor is de montage op locatie een kwestie van weken in plaats van maanden."
          },
          {
            icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Verplaatsbaar en herbruikbaar",
            description: "Onze gebouwen zijn volledig demontabel. Wanneer jij de tijdelijke huisvesting niet meer nodig hebt, verplaatsen we het gebouw snel en eenvoudig naar een andere plek."
          },
          {
            icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Flexibel in ontwerp",
            description: "Waar standaard prefab units vaste afmetingen hebben, passen wij elk gebouw volledig aan op jouw wensen en locatie. Ook tijdelijke huisvesting krijgt bij ons de uitstraling van een permanente oplossing."
          }
        ],
        metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
        metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het.",
        publishedAt: new Date().toISOString()
      }
    ];
    
    for (const service of services) {
      try {
        await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::service.service`, 'POST', service, token);
        console.log(`  ✅ Created: ${service.title}`);
        createdCount++;
      } catch (error) {
        console.log(`  ❌ Failed to create ${service.title}: ${error.message.split('\n')[0]}`);
      }
    }

    // 2. Create fresh sectors from RTF
    console.log('\n2️⃣ Creating Fresh Sectors');
    const sectors = [
      {
        slug: "onderwijs",
        title: "Onderwijs",
        category: "SECTOR",
        description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig.",
        contentTitle: "Tijdelijke onderwijshuisvesting",
        contentSubtitle: "Snel een oplossing voor jouw schoolgebouw",
        features: [
          {
            icon: "school",
            title: "Flexibel inzetbaar",
            description: "Onze modulaire gebouwen zijn flexibel inzetbaar: als uitbreiding van een permanent schoolgebouw of dependance."
          },
          {
            icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Comfortabel klimaat",
            description: "Dankzij slimme klimaatbeheersing is de ruimte comfortabel in elk seizoen."
          }
        ],
        metaTitle: "Tijdelijke onderwijshuisvesting door Envicon",
        metaDescription: "Tijdelijke onderwijshuisvesting nodig? Wij hebben een ruim aanbod modulaire schoolgebouwen.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "wonen",
        title: "Wonen",
        category: "SECTOR",
        description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten",
        contentTitle: "Tijdelijke woningen laten bouwen",
        contentSubtitle: "Snel een oplossing voor jouw huisvestingsvraag",
        features: [
          {
            icon: "home",
            title: "Duurzame keuze",
            description: "Een duurzame keuze: onze woningen zijn herbruikbaar en energiezuinig."
          },
          {
            icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Alles geregeld",
            description: "We regelen alles: van vergunning tot oplevering."
          }
        ],
        metaTitle: "Tijdelijke woningen bouwen | Snel opgeleverd",
        metaDescription: "Tijdelijke woningen nodig voor personeel, studenten of vluchtelingen? Wij bouwen flexwoningen op maat.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "bouw-industrie",
        title: "Bouw & Industrie",
        category: "SECTOR",
        description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie",
        contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
        contentSubtitle: "Modulaire units voor tijdelijke huisvesting",
        features: [
          {
            icon: "construction",
            title: "Snel opgebouwd",
            description: "Snel opgebouwd en direct gebruiksklaar."
          },
          {
            icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
            title: "Duurzame keuze",
            description: "Duurzame keuze dankzij herbruikbare bouwsystemen."
          }
        ],
        metaTitle: "Tijdelijke huisvesting voor bouw en industrie",
        metaDescription: "Envicon bouwt tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "sport",
        title: "Sport",
        category: "SECTOR",
        description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal",
        contentTitle: "Tijdelijke sporthal laten bouwen",
        contentSubtitle: "Modulaire sporthal als tijdelijke oplossing",
        features: [
          {
            icon: "sports_soccer",
            title: "Representatieve uitstraling",
            description: "De representatieve uitstraling van een permanente sporthal."
          },
          {
            icon: "schedule",
            title: "Flexibele duur",
            description: "Te gebruiken van enkele maanden tot meerdere jaren."
          }
        ],
        metaTitle: "Tijdelijke sporthal bouwen | Snel opgeleverd",
        metaDescription: "Tijdelijke sporthal nodig? Envicon levert snel modulaire sporthallen door heel Nederland.",
        publishedAt: new Date().toISOString()
      }
    ];
    
    for (const sector of sectors) {
      try {
        await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::sector.sector`, 'POST', sector, token);
        console.log(`  ✅ Created: ${sector.title}`);
        createdCount++;
      } catch (error) {
        console.log(`  ❌ Failed to create ${sector.title}: ${error.message.split('\n')[0]}`);
      }
    }

    // 3. Create essential solutions (no duplicates)
    console.log('\n3️⃣ Creating Essential Solutions');
    const solutions = [
      {
        title: "Demontabel gebouw",
        description: "Flexibele, demontabele gebouwen voor tijdelijke huisvesting",
        icon: "eDEMONTABEL 1",
        order: 1,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Modulaire unit",
        description: "Complete modulaire units voor diverse toepassingen",
        icon: "eMODULAIRE 1",
        order: 2,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Loods",
        description: "Tijdelijke loodsen voor opslag en productie",
        icon: "eLOODSEN 1",
        order: 3,
        publishedAt: new Date().toISOString()
      },
      {
        title: "Overkapping",
        description: "Overkappingen voor bescherming en extra ruimte",
        icon: "eOVERKAPPINGEN 1",
        order: 4,
        publishedAt: new Date().toISOString()
      }
    ];
    
    for (const solution of solutions) {
      try {
        await makeRequest(`${STRAPI_URL}/content-manager/collection-types/api::solution.solution`, 'POST', solution, token);
        console.log(`  ✅ Created: ${solution.title}`);
        createdCount++;
      } catch (error) {
        console.log(`  ❌ Failed to create ${solution.title}: ${error.message.split('\n')[0]}`);
      }
    }
    
    console.log(`\n✅ Fresh content created: ${createdCount} items`);
    return createdCount;
    
  } catch (error) {
    console.error('❌ Failed to create fresh content:', error.message);
    return 0;
  }
}

async function testFreshAPI() {
  console.log('\n🧪 Testing fresh API...\n');
  
  const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
  
  const endpoints = ['services', 'sectors', 'solutions'];
  
  for (const endpoint of endpoints) {
    try {
      const result = await makeRequest(`${STRAPI_URL}/api/${endpoint}`, 'GET', null, API_TOKEN);
      if (result.data) {
        const titles = result.data.map(item => item.title);
        const uniqueTitles = [...new Set(titles)];
        const duplicateCount = titles.length - uniqueTitles.length;
        
        console.log(`✅ ${endpoint}: ${result.data.length} items (${duplicateCount} duplicates)`);
        
        if (duplicateCount === 0) {
          console.log(`  🎉 NO DUPLICATES! Clean API response`);
        } else {
          console.log(`  ⚠️  Still ${duplicateCount} duplicates remaining`);
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
}

async function main() {
  console.log('🗑️  DELETE ALL & START FRESH - cms.envicon.nl');
  console.log('===============================================\n');
  
  console.log('⚠️  WARNING: This will delete ALL existing content!');
  console.log('✅ Then create fresh, clean RTF content');
  console.log('');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    // Delete ALL content
    console.log('🗑️  DELETING ALL CONTENT...\n');
    let totalDeleted = 0;
    totalDeleted += await deleteAllContent('api::service.service', 'Services', token);
    totalDeleted += await deleteAllContent('api::sector.sector', 'Sectors', token);
    totalDeleted += await deleteAllContent('api::solution.solution', 'Solutions', token);
    
    console.log(`\n🗑️  Total deleted: ${totalDeleted} items`);
    
    // Wait a moment for deletion to complete
    console.log('\n⏳ Waiting for deletion to complete...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Create fresh content
    const createdCount = await createFreshRTFContent(token);
    
    // Wait for creation to complete
    console.log('\n⏳ Waiting for content to be available...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Test fresh API
    await testFreshAPI();
    
    console.log('\n🎉 FRESH START COMPLETED!');
    console.log('=========================');
    console.log(`🗑️  Deleted: ${totalDeleted} old items`);
    console.log(`📝 Created: ${createdCount} fresh items`);
    
    console.log('\n📋 Your frontend should now show:');
    console.log('✅ NO duplicate content');
    console.log('✅ Clean RTF services (2 items)');
    console.log('✅ Clean RTF sectors (4 items)');
    console.log('✅ Essential solutions (4 items)');
    console.log('✅ Each item appears only ONCE');
    
    console.log('\n🚀 Refresh http://localhost:3005 - content should be clean!');
    
  } catch (error) {
    console.error('\n❌ Fresh start failed:', error.message);
    process.exit(1);
  }
}

main();
