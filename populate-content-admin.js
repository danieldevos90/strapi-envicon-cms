#!/usr/bin/env node

/**
 * Content Population via Admin Login
 * This script logs in as admin and creates content via the admin API
 */

const http = require('http');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@envicon.nl';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Envicon2024!Admin';

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path.startsWith('http') ? path : `${STRAPI_URL}${path}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
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
            reject(new Error(`${method} ${path} failed: ${res.statusCode} ${res.statusMessage}\n${JSON.stringify(jsonData, null, 2)}`));
          }
        } catch (error) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, body });
          } else {
            reject(new Error(`${method} ${path} failed: ${res.statusCode} ${res.statusMessage}\n${body}`));
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

    const result = await makeRequest('/admin/login', 'POST', loginData);
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
    const result = await makeRequest(endpoint, 'PUT', data, token);
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
    const result = await makeRequest(endpoint, 'POST', data, token);
    console.log(`✅ ${name} created successfully!`);
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to create ${name}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Content Population via Admin API');
  console.log('============================================\n');
  
  try {
    // Login as admin
    const token = await loginAdmin();
    console.log('');
    
    let successCount = 0;
    let totalCount = 0;

    // 1. Create Homepage
    console.log('1️⃣ Creating Homepage...');
    totalCount++;
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
      successCount++;
    }
    console.log('');

    // 2. Create About Page
    console.log('2️⃣ Creating About Page...');
    totalCount++;
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
      successCount++;
    }
    console.log('');

    // 3. Create Contact Page
    console.log('3️⃣ Creating Contact Page...');
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
      successCount++;
    }
    console.log('');

    // 4. Create Services
    console.log('4️⃣ Creating Services...');
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
      totalCount++;
      if (await createCollectionItem('/content-manager/collection-types/api::service.service', service, `Service: ${service.title}`, token)) {
        successCount++;
      }
    }
    console.log('');

    // 5. Create Sectors
    console.log('5️⃣ Creating Sectors...');
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
      totalCount++;
      if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', sector, `Sector: ${sector.title}`, token)) {
        successCount++;
      }
    }

    console.log('\n🎉 Content Population Completed!');
    console.log('================================');
    console.log(`📊 Success Rate: ${successCount}/${totalCount} items created`);
    
    if (successCount === totalCount) {
      console.log('✅ All content created successfully!');
    } else if (successCount > 0) {
      console.log('⚠️  Some content created successfully, some failed.');
    } else {
      console.log('❌ All content creation failed.');
    }

    console.log('\n📋 Next Steps:');
    console.log('1. Check content in Strapi admin panel');
    console.log('2. Test API endpoints with read-only token');
    console.log('3. Add images and media');
    console.log('4. Test your Next.js frontend');
    
  } catch (error) {
    console.error('\n❌ Content population failed:', error.message);
    process.exit(1);
  }
}

main();
