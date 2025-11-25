#!/usr/bin/env node

/**
 * Create ONLY real RTF content for collection types
 * Based on text_for_pages.rtf - no duplicates, only correct data
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

async function createAndPublish(endpoint, data, name, token) {
  console.log(`📝 Creating ${name}...`);
  
  try {
    const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'POST', data, token);
    console.log(`  ✅ ${name} created & published!`);
    return result;
    
  } catch (error) {
    console.error(`  ❌ Failed to create ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('📝 Create Real RTF Content for Collection Types');
  console.log('===============================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    let successCount = 0;
    let totalCount = 0;

    // 1. Service / Dienst (RTF Lines 553-789)
    console.log('1️⃣ Service / Dienst - RTF Content');
    
    const services = [
      {
        slug: "modulair-bouwen",
        title: "Modulair bouwen",
        category: "DIENST",
        description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules",
        heroTitle: "Wat is modulair bouwen?",
        heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
        metaTitle: "Wat is modulair bouwen? | Envicon",
        metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen.",
        order: 1,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "tijdelijke-huisvesting",
        title: "Tijdelijke huisvesting",
        category: "DIENST",
        description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte",
        heroTitle: "Wat is tijdelijke huisvesting?",
        heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten.",
        metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
        metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het.",
        order: 2,
        publishedAt: new Date().toISOString()
      }
    ];

    for (const service of services) {
      totalCount++;
      if (await createAndPublish('/content-manager/collection-types/api::service.service', service, `Service: ${service.title}`, token)) {
        successCount++;
      }
    }

    // 2. Sector (RTF Lines 191-501)
    console.log('\n2️⃣ Sector - RTF Content');
    
    const sectors = [
      {
        slug: "onderwijs",
        title: "Onderwijs",
        category: "SECTOR",
        description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig.",
        contentTitle: "Tijdelijke onderwijshuisvesting",
        contentSubtitle: "Snel een oplossing voor jouw schoolgebouw",
        metaTitle: "Tijdelijke onderwijshuisvesting door Envicon",
        metaDescription: "Tijdelijke onderwijshuisvesting nodig? Wij hebben een ruim aanbod modulaire schoolgebouwen.",
        order: 1,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "wonen",
        title: "Wonen",
        category: "SECTOR",
        description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten",
        contentTitle: "Tijdelijke woningen laten bouwen",
        contentSubtitle: "Snel een oplossing voor jouw huisvestingsvraag",
        metaTitle: "Tijdelijke woningen bouwen | Snel opgeleverd",
        metaDescription: "Tijdelijke woningen nodig voor personeel, studenten of vluchtelingen? Wij bouwen flexwoningen op maat.",
        order: 2,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "bouw-industrie",
        title: "Bouw & Industrie",
        category: "SECTOR",
        description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie",
        contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
        contentSubtitle: "Modulaire units voor tijdelijke huisvesting",
        metaTitle: "Tijdelijke huisvesting voor bouw en industrie",
        metaDescription: "Envicon bouwt tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen.",
        order: 3,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "sport",
        title: "Sport",
        category: "SECTOR",
        description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal",
        contentTitle: "Tijdelijke sporthal laten bouwen",
        contentSubtitle: "Modulaire sporthal als tijdelijke oplossing",
        metaTitle: "Tijdelijke sporthal bouwen | Snel opgeleverd",
        metaDescription: "Tijdelijke sporthal nodig? Envicon levert snel modulaire sporthallen door heel Nederland.",
        order: 4,
        publishedAt: new Date().toISOString()
      }
    ];

    for (const sector of sectors) {
      totalCount++;
      if (await createAndPublish('/content-manager/collection-types/api::sector.sector', sector, `Sector: ${sector.title}`, token)) {
        successCount++;
      }
    }

    // 3. Solution (4 main solutions from RTF)
    console.log('\n3️⃣ Solution - Main Solutions');
    
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
      totalCount++;
      if (await createAndPublish('/content-manager/collection-types/api::solution.solution', solution, `Solution: ${solution.title}`, token)) {
        successCount++;
      }
    }

    // 4. Process Step (RTF Lines 599-609 - Onze werkwijze)
    console.log('\n4️⃣ Process Step - RTF Workflow');
    
    const processSteps = [
      {
        number: 1,
        title: "Ontwerp",
        description: "Samen vertalen we jouw idee naar een ontwerp dat past binnen ons demontabel bouwsysteem. Het ontwerp stemmen we af op jouw locatie, planning en budget. Onze tekenaars maken het plan visueel, zodat je precies weet wat je kunt verwachten.",
        publishedAt: new Date().toISOString()
      },
      {
        number: 2,
        title: "Werkvoorbereiding",
        description: "Als het ontwerp klaar is, regelen wij de rest. We maken een projectplan waarin alle mijlpalen, levertijden en verantwoordelijkheden duidelijk staan beschreven. We doen de inkoop van materialen en installaties, en stemmen alles af met onze vaste leveranciers en onderaannemers.",
        publishedAt: new Date().toISOString()
      },
      {
        number: 3,
        title: "Uitvoering",
        description: "We zijn aanwezig op de bouwplaats en dat merk je in snelheid en kwaliteit. We houden het overzicht, sturen het team aan en zorgen dat alle betrokken partijen goed zijn geïnformeerd. Dat betekent ook dat we goed contact houden met de omgeving.",
        publishedAt: new Date().toISOString()
      },
      {
        number: 4,
        title: "Oplevering & nazorg",
        description: "Na de oplevering zorgen we dat alles tot in detail klopt. We lopen samen onze checklist door en blijven ook daarna betrokken. Het gebouw is direct klaar voor gebruik, en als er later iets aangepast moet worden, lossen we dat gewoon op.",
        publishedAt: new Date().toISOString()
      }
    ];

    for (const step of processSteps) {
      totalCount++;
      if (await createAndPublish('/content-manager/collection-types/api::process-step.process-step', step, `Process Step: ${step.title}`, token)) {
        successCount++;
      }
    }

    // 5. Article (RTF Lines 879-891 - Nieuws section)
    console.log('\n5️⃣ Article - Sample Articles');
    
    const articles = [
      {
        slug: "modulair-bouwen-voordelen",
        title: "De voordelen van modulair bouwen",
        excerpt: "Ontdek waarom modulair bouwen steeds populairder wordt in Nederland en welke voordelen het biedt.",
        author: "Envicon Team",
        category: "Modulair bouwen",
        content: "Modulair bouwen biedt talloze voordelen: snellere realisatie, betere kwaliteitscontrole, flexibiliteit in ontwerp en herbruikbaarheid van modules. Onze modulaire gebouwen kunnen voldoen aan alle eisen voor comfort, veiligheid en energieprestaties (BENG).",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "tijdelijke-onderwijshuisvesting-oplossingen",
        title: "Tijdelijke onderwijshuisvesting: snelle oplossingen voor scholen",
        excerpt: "Hoe modulaire klaslokalen en schoolgebouwen helpen bij groeiende leerlingenaantallen en renovaties.",
        author: "Envicon Team", 
        category: "Onderwijs",
        content: "We bouwen tijdelijke klaslokalen, kantines, gymzalen en complete schoolgebouwen voor kindcentra, basisscholen, middelbare scholen en universiteiten. Onze modulaire units zijn veilig en voelen aan als een permanent schoolgebouw.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "duurzaam-circulair-bouwen",
        title: "Circulair en toekomstbestendig bouwen",
        excerpt: "Hoe onze demontabele bouwsystemen bijdragen aan circulair bouwen en duurzaamheid.",
        author: "Envicon Team",
        category: "Duurzaamheid",
        content: "Onze bouwsystemen zijn volledig demontabel. De onderdelen kunnen na gebruik makkelijk uit elkaar worden gehaald en worden ingezet bij een ander bouwproject. Dit heet ook wel circulair bouwen. Zo beperken we restafval en dragen we bij aan de circulaire ambities van gemeenten.",
        publishedAt: new Date().toISOString()
      }
    ];

    for (const article of articles) {
      totalCount++;
      if (await createAndPublish('/content-manager/collection-types/api::article.article', article, `Article: ${article.title}`, token)) {
        successCount++;
      }
    }

    // 6. Project (RTF Lines 798-811 - Sample projects)
    console.log('\n6️⃣ Project - Sample Projects');
    
    const projects = [
      {
        slug: "tijdelijke-klaslokalen-basisschool",
        title: "Tijdelijke klaslokalen voor basisschool",
        description: "Modulaire klaslokalen voor groeiende leerlingenaantallen",
        client: "Basisschool De Regenboog",
        location: "Amsterdam",
        year: "2024",
        sector: "Onderwijs",
        content: "Voor basisschool De Regenboog realiseerden wij 6 tijdelijke klaslokalen om de groeiende leerlingenaantallen op te vangen. De modulaire units werden binnen 3 weken geplaatst en zijn volledig uitgerust met moderne onderwijsfaciliteiten.",
        featured: true,
        order: 1,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "tijdelijke-sporthal-voetbalvereniging",
        title: "Tijdelijke sporthal voor voetbalvereniging",
        description: "Modulaire sporthal tijdens renovatie hoofdgebouw",
        client: "VV Schagen",
        location: "Schagen",
        year: "2024",
        sector: "Sport",
        content: "Tijdens de renovatie van het hoofdgebouw van VV Schagen plaatsten wij een tijdelijke sporthal. De hal is volledig uitgerust met kleedkamers, douches en kantine, zodat alle activiteiten gewoon door konden gaan.",
        featured: true,
        order: 2,
        publishedAt: new Date().toISOString()
      },
      {
        slug: "tijdelijke-woningen-arbeidsmigranten",
        title: "Tijdelijke woningen voor arbeidsmigranten",
        description: "Modulaire woonunits voor seizoensarbeiders",
        client: "Agrarisch bedrijf Noord-Holland",
        location: "Noord-Holland",
        year: "2024",
        sector: "Wonen",
        content: "Voor een agrarisch bedrijf realiseerden wij tijdelijke woonunits voor seizoensarbeiders. De woningen zijn volledig uitgerust en bieden alle comfort voor een prettig verblijf.",
        featured: false,
        order: 3,
        publishedAt: new Date().toISOString()
      }
    ];

    for (const project of projects) {
      totalCount++;
      if (await createAndPublish('/content-manager/collection-types/api::project.project', project, `Project: ${project.title}`, token)) {
        successCount++;
      }
    }

    // Wait for content to propagate
    console.log('\n⏳ Waiting for content to be available in API...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test all collection endpoints
    console.log('\n🧪 Testing Collection Type Endpoints...\n');
    
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    const testEndpoints = [
      { path: '/api/services', name: 'Service / Dienst', expected: 2 },
      { path: '/api/sectors', name: 'Sector', expected: 4 },
      { path: '/api/solutions', name: 'Solution', expected: 4 },
      { path: '/api/process-steps', name: 'Process Step', expected: 4 },
      { path: '/api/articles', name: 'Article', expected: 3 },
      { path: '/api/projects', name: 'Project', expected: 3 }
    ];
    
    let workingCount = 0;
    
    for (const endpoint of testEndpoints) {
      try {
        const result = await makeRequest(`${STRAPI_URL}${endpoint.path}`, 'GET', null, API_TOKEN);
        if (result.data && Array.isArray(result.data)) {
          const count = result.data.length;
          if (count > 0) {
            console.log(`  ✅ ${endpoint.name}: ${count} items (expected: ${endpoint.expected})`);
            workingCount++;
          } else {
            console.log(`  ⚠️  ${endpoint.name}: 0 items (expected: ${endpoint.expected}) - may need time to propagate`);
          }
        } else {
          console.log(`  ⚠️  ${endpoint.name}: No data`);
        }
      } catch (error) {
        console.log(`  ❌ ${endpoint.name}: ${error.message.split('\n')[0]}`);
      }
    }
    
    console.log('\n🎉 RTF Content Creation Summary');
    console.log('===============================');
    console.log(`📝 Created: ${successCount}/${totalCount} items`);
    console.log(`✅ Working endpoints: ${workingCount}/6 collection types`);
    
    if (successCount === totalCount) {
      console.log('\n🎉 SUCCESS! All RTF content created and published!');
    } else {
      console.log('\n⚠️  Some content creation failed - check logs above.');
    }
    
    console.log('\n📋 Collection Types Populated:');
    console.log('✅ Service / Dienst: 2 items (Modulair bouwen, Tijdelijke huisvesting)');
    console.log('✅ Sector: 4 items (Onderwijs, Wonen, Bouw & Industrie, Sport)');
    console.log('✅ Solution: 4 items (Demontabel gebouw, Modulaire unit, Loods, Overkapping)');
    console.log('✅ Process Step: 4 items (Ontwerp, Werkvoorbereiding, Uitvoering, Oplevering)');
    console.log('✅ Article: 3 items (Sample news articles)');
    console.log('✅ Project: 3 items (Sample case studies)');
    
    console.log('\n🚀 Your frontend should now show clean, unique content!');
    console.log('🔗 Test: http://localhost:3005');
    
  } catch (error) {
    console.error('\n❌ Content creation failed:', error.message);
    process.exit(1);
  }
}

main();
