#!/usr/bin/env node

/**
 * Check all cms.envicon.nl endpoints and fix content
 */

const https = require('https');
const http = require('http');

const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
const STRAPI_URL = 'https://cms.envicon.nl';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

function makeRequest(url, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = client.request(options, (res) => {
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
            reject(new Error(`${method} ${url} failed: ${res.statusCode} ${res.statusMessage}\n${JSON.stringify(jsonData, null, 2)}`));
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

async function checkEndpoint(endpoint, name) {
  console.log(`🔍 Checking ${name}...`);
  
  try {
    const result = await makeRequest(`${STRAPI_URL}/api${endpoint}`, 'GET', null, API_TOKEN);
    
    if (result.data) {
      if (Array.isArray(result.data)) {
        console.log(`  ✅ ${name}: ${result.data.length} items found`);
        return { status: 'success', count: result.data.length, data: result.data };
      } else {
        console.log(`  ✅ ${name}: Content found`);
        return { status: 'success', count: 1, data: result.data };
      }
    } else {
      console.log(`  ⚠️  ${name}: No content found`);
      return { status: 'empty', count: 0, data: null };
    }
    
  } catch (error) {
    console.log(`  ❌ ${name}: ${error.message.split('\n')[0]}`);
    return { status: 'error', count: 0, error: error.message };
  }
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
    console.log(`✅ ${name} created successfully!`);
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to create ${name}:`, error.message);
    return null;
  }
}

async function createCollectionItem(endpoint, data, name, token) {
  console.log(`📝 Creating ${name}...`);
  
  try {
    const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'POST', data, token);
    console.log(`✅ ${name} created successfully!`);
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to create ${name}:`, error.message);
    return null;
  }
}

async function fixMissingContent(missingContent, token) {
  console.log('\n🔧 Fixing missing content...\n');
  
  let fixedCount = 0;
  
  // Fix Homepage
  if (missingContent.includes('homepage')) {
    const homepageData = {
      heroTitle: "Specialist in modulair bouwen",
      heroSubtitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
      heroButton1Text: "Meer over modulair bouwen",
      heroButton1Url: "/diensten/modulair-bouwen",
      heroButton2Text: "Vraag een adviesgesprek aan",
      heroButton2Url: "/adviesgesprek",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::homepage.homepage', homepageData, 'Homepage', token)) {
      fixedCount++;
    }
  }

  // Fix About Page
  if (missingContent.includes('about-page')) {
    const aboutData = {
      heroTitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon bouwt sneller en slimmer, zonder in te leveren op kwaliteit. Onze tijdelijke gebouwen zijn net zo comfortabel en gebruiksvriendelijk als permanente huisvesting. We leveren modulaire gebouwen waarin mensen graag werken, leren of sporten én die er ook nog eens goed uitzien. Bij ons ben je in goede handen: van de eerste schets tot en met de oplevering.",
      teamTitle: "Het team",
      teamContent: "Envicon is opgericht door Kyle Lambert en Steven Hageman, twee professionals met een hart voor de bouw. Ze zagen dat er tijdens bouwprojecten regelmatig een afstand ontstond tussen opdrachtgever en bouwer, en besloten het anders te doen: persoonlijker, sneller en transparanter. Kyle heeft een achtergrond in projectmanagement en ondernemerschap binnen de installatietechniek. Steven werkt al meer dan tien jaar in de modulaire bouw.",
      companyTitle: "Modulair bouwer in Nederland",
      companyContent: "Als modulair bouwer werken we door heel Nederland. We ontwikkelen diverse tijdelijke bouwoplossingen: van tijdelijke klaslokalen en flexwoningen tot kantoorruimtes en personeelshuisvesting in de bouw en industrie. Dankzij ons landelijke netwerk kunnen we snel starten en flexibel opschalen, waar jouw bouwproject ook is. De modules voor onze gebouwen worden geproduceerd door onze vaste partners in Nederland.",
      certificationsTitle: "Certificeringen & lidmaatschappen",
      certificationsContent: "Op de website plaatsen als de certificaten binnen zijn.",
      ctaTitle: "Op zoek naar een modulair bouwer in Nederland?",
      metaTitle: "Over ons – Envicon – Modulair bouwer",
      metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::about-page.about-page', aboutData, 'About Page', token)) {
      fixedCount++;
    }
  }

  // Fix Contact Page
  if (missingContent.includes('contact-page')) {
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
          title: "Kan ik ook telefonisch overleggen over mijn project?",
          content: "Zeker, we denken graag met je mee. Je kunt ons bellen tijdens kantooruren of een bericht achterlaten via het formulier, we bellen je dan zo snel mogelijk op."
        },
        {
          title: "Werkt Envicon ook voor particuliere klanten?",
          content: "Nee, we richten ons volledig op zakelijke opdrachtgevers zoals gemeenten, onderwijsinstellingen, sportorganisaties en bedrijven."
        },
        {
          title: "Kunnen jullie helpen bij de aanvraag van vergunningen of regelgeving?",
          content: "Ja, dat doen we graag. Envicon regelt de complete vergunningaanvraag voor tijdelijke en modulaire bouw. We leveren alle documenten correct aan en zorgen ervoor dat het proces soepel verloopt. We hebben kennis van de geldende wet- en regelgeving."
        }
      ],
      formTitle: "Contactformulier",
      formDescription: "Vul het formulier in en wij nemen binnen 24 uur contact met u op.",
      metaTitle: "Neem contact op | Envicon",
      metaDescription: "Heb je plannen voor tijdelijke bouw? Bel 085 273 67 54 of mail naar hallo@envicon.nl",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::contact-page.contact-page', contactData, 'Contact Page', token)) {
      fixedCount++;
    }
  }

  // Fix Services
  if (missingContent.includes('services')) {
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
        publishedAt: new Date().toISOString()
      },
      {
        slug: "tijdelijke-huisvesting",
        title: "Tijdelijke huisvesting",
        category: "DIENST",
        description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte",
        heroTitle: "Wat is tijdelijke huisvesting?",
        heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.",
        metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
        metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het.",
        publishedAt: new Date().toISOString()
      }
    ];

    for (const service of services) {
      if (await createCollectionItem('/content-manager/collection-types/api::service.service', service, `Service: ${service.title}`, token)) {
        fixedCount++;
      }
    }
  }

  // Fix Sectors
  if (missingContent.includes('sectors')) {
    const sectors = [
      {
        slug: "onderwijs",
        title: "Onderwijs",
        category: "SECTOR",
        description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig.",
        contentTitle: "Tijdelijke onderwijshuisvesting",
        contentSubtitle: "Snel een oplossing voor jouw schoolgebouw",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "wonen",
        title: "Wonen",
        category: "SECTOR",
        description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten.",
        contentTitle: "Tijdelijke woningen laten bouwen",
        contentSubtitle: "Flexibele woonoplossingen voor diverse situaties",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "bouw-industrie",
        title: "Bouw & Industrie",
        category: "SECTOR",
        description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie.",
        contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
        contentSubtitle: "Kantoren, werkplaatsen en faciliteiten voor de bouwsector",
        publishedAt: new Date().toISOString()
      },
      {
        slug: "sport",
        title: "Sport",
        category: "SECTOR",
        description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal.",
        contentTitle: "Tijdelijke sporthal laten bouwen",
        contentSubtitle: "Flexibele sportaccommodaties voor elke gelegenheid",
        publishedAt: new Date().toISOString()
      }
    ];

    for (const sector of sectors) {
      if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', sector, `Sector: ${sector.title}`, token)) {
        fixedCount++;
      }
    }
  }

  return fixedCount;
}

async function main() {
  console.log('🔍 Checking cms.envicon.nl Endpoints');
  console.log('====================================\n');
  
  const endpoints = [
    { path: '/homepage', name: 'Homepage' },
    { path: '/about-page', name: 'About Page' },
    { path: '/contact-page', name: 'Contact Page' },
    { path: '/services', name: 'Services' },
    { path: '/sectors', name: 'Sectors' },
    { path: '/articles', name: 'Articles' },
    { path: '/projects', name: 'Projects' },
    { path: '/solutions', name: 'Solutions' },
    { path: '/navigation', name: 'Navigation' },
    { path: '/footer', name: 'Footer' },
    { path: '/forms-config', name: 'Forms Config' },
    { path: '/envicon-seo-config', name: 'SEO Config' }
  ];

  const results = {};
  const missingContent = [];
  let totalEndpoints = 0;
  let workingEndpoints = 0;

  // Check all endpoints
  for (const endpoint of endpoints) {
    totalEndpoints++;
    const result = await checkEndpoint(endpoint.path, endpoint.name);
    results[endpoint.name.toLowerCase().replace(/\s+/g, '-')] = result;
    
    if (result.status === 'success') {
      workingEndpoints++;
    } else if (result.status === 'empty' || result.status === 'error') {
      missingContent.push(endpoint.name.toLowerCase().replace(/\s+/g, '-'));
    }
  }

  console.log('\n📊 Endpoint Check Summary');
  console.log('=========================');
  console.log(`✅ Working: ${workingEndpoints}/${totalEndpoints} endpoints`);
  console.log(`⚠️  Missing/Error: ${totalEndpoints - workingEndpoints} endpoints`);

  if (missingContent.length > 0) {
    console.log('\n🔧 Missing content detected. Attempting to fix...');
    
    try {
      const token = await loginAdmin();
      console.log('');
      
      const fixedCount = await fixMissingContent(missingContent, token);
      
      console.log(`\n✅ Fixed ${fixedCount} content items`);
      
      // Re-check endpoints after fixing
      console.log('\n🔄 Re-checking endpoints...\n');
      
      let newWorkingCount = 0;
      for (const endpoint of endpoints) {
        const result = await checkEndpoint(endpoint.path, endpoint.name);
        if (result.status === 'success') {
          newWorkingCount++;
        }
      }
      
      console.log('\n📊 Final Status');
      console.log('===============');
      console.log(`✅ Working: ${newWorkingCount}/${totalEndpoints} endpoints`);
      
      if (newWorkingCount === totalEndpoints) {
        console.log('🎉 All endpoints are now working!');
      } else {
        console.log('⚠️  Some endpoints may need manual attention in Strapi admin.');
      }
      
    } catch (error) {
      console.error('\n❌ Failed to fix content:', error.message);
    }
  } else {
    console.log('\n🎉 All endpoints are working correctly!');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Check content in Strapi admin: https://cms.envicon.nl/admin');
  console.log('2. Verify all content is published');
  console.log('3. Test your Next.js frontend with the API');
  console.log('4. Add images and media as needed');
}

main().catch(console.error);
