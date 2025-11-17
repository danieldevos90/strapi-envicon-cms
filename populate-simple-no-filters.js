#!/usr/bin/env node

/**
 * Simple content population without filters (bypasses ModSecurity WAF)
 */

const https = require('https');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@envicon.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Envicon2024!Admin';

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

async function createContent(endpoint, data, name, token) {
  console.log(`📝 Creating ${name}...`);
  
  try {
    const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'PUT', data, token);
    console.log(`  ✅ ${name} created successfully!`);
    return result;
    
  } catch (error) {
    console.error(`  ❌ Failed to create ${name}:`, error.message);
    return null;
  }
}

async function createCollectionItem(endpoint, data, name, token) {
  console.log(`📝 Creating ${name}...`);
  
  try {
    const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'POST', data, token);
    console.log(`  ✅ ${name} created successfully!`);
    return result;
    
  } catch (error) {
    console.error(`  ❌ Failed to create ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Simple RTF Content Population (No Filters)');
  console.log('==============================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    let successCount = 0;
    let totalCount = 0;

    // 1. About Page
    console.log('1️⃣ About Page');
    totalCount++;
    const aboutData = {
      heroTitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon bouwt sneller en slimmer, zonder in te leveren op kwaliteit. Onze tijdelijke gebouwen zijn net zo comfortabel en gebruiksvriendelijk als permanente huisvesting. We leveren modulaire gebouwen waarin mensen graag werken, leren of sporten én die er ook nog eens goed uitzien.",
      teamTitle: "Het team",
      teamContent: "Envicon is opgericht door Kyle Lambert en Steven Hageman, twee professionals met een hart voor de bouw. Kyle heeft een achtergrond in projectmanagement en ondernemerschap binnen de installatietechniek. Steven werkt al meer dan tien jaar in de modulaire bouw.",
      companyTitle: "Modulair bouwer in Nederland",
      companyContent: "Als modulair bouwer werken we door heel Nederland. We ontwikkelen diverse tijdelijke bouwoplossingen: van tijdelijke klaslokalen en flexwoningen tot kantoorruimtes en personeelshuisvesting in de bouw en industrie.",
      certificationsTitle: "Certificeringen & lidmaatschappen",
      certificationsContent: "Op de website plaatsen als de certificaten binnen zijn.",
      ctaTitle: "Op zoek naar een modulair bouwer in Nederland?",
      metaTitle: "Over ons – Envicon – Modulair bouwer",
      metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::about-page.about-page', aboutData, 'About Page', token)) {
      successCount++;
    }

    // 2. Contact Page
    console.log('\n2️⃣ Contact Page');
    totalCount++;
    const contactData = {
      heroTitle: "Neem contact op",
      heroDescription: "Heb je vragen over tijdelijke huisvesting of een ander modulair bouwproject? Vul het formulier in, dan nemen we binnen 24 uur contact met je op om jouw aanvraag te bespreken. Vervolgens ontvang je een persoonlijke offerte.",
      benefits: [
        {
          icon: "speed",
          title: "Persoonlijke en vrijblijvende offerte binnen één werkdag",
          description: "We reageren snel en geven je binnen één werkdag een persoonlijke offerte"
        },
        {
          icon: "consultation", 
          title: "Eerlijk en persoonlijk advies",
          description: "We denken met je mee en geven eerlijk advies over de beste oplossing"
        },
        {
          icon: "transparency",
          title: "Transparante prijzen", 
          description: "Heldere prijzen zonder verborgen kosten, zodat je weet waar je aan toe bent"
        }
      ],
      faqItems: [
        {
          title: "Wat heb ik nodig om een offerte aan te vragen?",
          content: "Een korte omschrijving van jouw bouwproject is voldoende. Denk aan het type gebouw, de gewenste grootte en de locatie. We nemen snel contact met je op om de details samen door te nemen."
        },
        {
          title: "Kunnen jullie helpen bij de aanvraag van vergunningen of regelgeving?",
          content: "Ja, dat doen we graag. Envicon regelt de complete vergunningaanvraag voor tijdelijke en modulaire bouw. We leveren alle documenten correct aan en zorgen ervoor dat het proces soepel verloopt."
        }
      ],
      formTitle: "Contactformulier",
      formDescription: "Vul het formulier in en wij nemen binnen 24 uur contact met u op.",
      metaTitle: "Neem contact op | Envicon",
      metaDescription: "Heb je plannen voor tijdelijke bouw? Bel 085 273 67 54 of mail naar hallo@envicon.nl",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::contact-page.contact-page', contactData, 'Contact Page', token)) {
      successCount++;
    }

    // 3. Create Services (without checking for existing)
    console.log('\n3️⃣ Services');
    
    // Modulair bouwen
    totalCount++;
    const modulairData = {
      slug: "modulair-bouwen",
      title: "Modulair bouwen",
      category: "DIENST",
      description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules",
      heroTitle: "Wat is modulair bouwen?",
      heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
      metaTitle: "Wat is modulair bouwen? | Envicon",
      metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::service.service', modulairData, 'Service: Modulair bouwen', token)) {
      successCount++;
    }

    // Tijdelijke huisvesting
    totalCount++;
    const tijdelijkData = {
      slug: "tijdelijke-huisvesting",
      title: "Tijdelijke huisvesting",
      category: "DIENST", 
      description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte",
      heroTitle: "Wat is tijdelijke huisvesting?",
      heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten.",
      metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
      metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::service.service', tijdelijkData, 'Service: Tijdelijke huisvesting', token)) {
      successCount++;
    }

    // 4. Create Sectors (without checking for existing)
    console.log('\n4️⃣ Sectors');
    
    const sectors = [
      {
        slug: "onderwijs",
        title: "Onderwijs", 
        category: "SECTOR",
        description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig.",
        contentTitle: "Tijdelijke onderwijshuisvesting",
        metaTitle: "Tijdelijke onderwijshuisvesting door Envicon",
        metaDescription: "Tijdelijke onderwijshuisvesting nodig? Wij hebben een ruim aanbod modulaire schoolgebouwen.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "wonen",
        title: "Wonen",
        category: "SECTOR", 
        description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten.",
        contentTitle: "Tijdelijke woningen laten bouwen",
        metaTitle: "Tijdelijke woningen bouwen | Snel opgeleverd",
        metaDescription: "Tijdelijke woningen nodig voor personeel, studenten of vluchtelingen? Wij bouwen flexwoningen op maat.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "bouw-industrie",
        title: "Bouw & Industrie",
        category: "SECTOR",
        description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie.",
        contentTitle: "Tijdelijke huisvesting voor bouw en industrie", 
        metaTitle: "Tijdelijke huisvesting voor bouw en industrie",
        metaDescription: "Envicon bouwt tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen.",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "sport",
        title: "Sport",
        category: "SECTOR",
        description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal.",
        contentTitle: "Tijdelijke sporthal laten bouwen",
        metaTitle: "Tijdelijke sporthal bouwen | Snel opgeleverd", 
        metaDescription: "Tijdelijke sporthal nodig? Envicon levert snel modulaire sporthallen door heel Nederland.",
        publishedAt: new Date().toISOString()
      }
    ];

    for (const sector of sectors) {
      totalCount++;
      if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', sector, `Sector: ${sector.title}`, token)) {
        successCount++;
      }
    }

    console.log('\n🎉 Content Population Completed!');
    console.log(`📊 Success: ${successCount}/${totalCount} items created`);
    
    // Test key endpoints
    console.log('\n🧪 Testing key endpoints...');
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    const testEndpoints = ['/api/homepage', '/api/about-page', '/api/contact-page'];
    
    for (const endpoint of testEndpoints) {
      try {
        const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'GET', null, API_TOKEN);
        console.log(`  ✅ ${endpoint}: Working`);
      } catch (error) {
        console.log(`  ❌ ${endpoint}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('\n❌ Population failed:', error.message);
    process.exit(1);
  }
}

main();
