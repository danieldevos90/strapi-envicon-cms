#!/usr/bin/env node

/**
 * Complete Content Population Script
 * Based on text_for_pages.rtf and CONTENT_CHECKLIST.md
 */

const http = require('http');

const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 1337,
      path: `/api${path}`,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };

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
            reject(new Error(`${method} ${path} failed: ${res.statusCode} ${res.statusMessage}\n${body}`));
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${body}`));
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

async function createHomepage() {
  console.log('📝 Creating Homepage...');
  
  try {
    const homepageData = {
      data: {
        heroTitle: "Specialist in modulair bouwen",
        heroSubtitle: "Tijdelijke bouw, permanente kwaliteit",
        heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
        heroButton1Text: "Meer over modulair bouwen",
        heroButton1Url: "/diensten/modulair-bouwen",
        heroButton2Text: "Vraag een adviesgesprek aan",
        heroButton2Url: "/adviesgesprek",
        publishedAt: new Date().toISOString()
      }
    };

    const result = await makeRequest('/homepage', 'PUT', homepageData);
    console.log('✅ Homepage created successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create homepage:', error.message);
    return null;
  }
}

async function createService(serviceData) {
  console.log(`📝 Creating Service: ${serviceData.title}...`);
  
  try {
    // Check if service exists
    const existing = await makeRequest(`/services?filters[slug][$eq]=${serviceData.slug}`);
    
    const payload = {
      data: {
        ...serviceData,
        publishedAt: new Date().toISOString()
      }
    };

    let result;
    if (existing.data && existing.data.length > 0) {
      // Update existing
      result = await makeRequest(`/services/${existing.data[0].id}`, 'PUT', payload);
      console.log(`✅ Updated service: ${serviceData.title}`);
    } else {
      // Create new
      result = await makeRequest('/services', 'POST', payload);
      console.log(`✅ Created service: ${serviceData.title}`);
    }
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to create service ${serviceData.title}:`, error.message);
    return null;
  }
}

async function createSector(sectorData) {
  console.log(`📝 Creating Sector: ${sectorData.title}...`);
  
  try {
    // Check if sector exists
    const existing = await makeRequest(`/sectors?filters[slug][$eq]=${sectorData.slug}`);
    
    const payload = {
      data: {
        ...sectorData,
        publishedAt: new Date().toISOString()
      }
    };

    let result;
    if (existing.data && existing.data.length > 0) {
      // Update existing
      result = await makeRequest(`/sectors/${existing.data[0].id}`, 'PUT', payload);
      console.log(`✅ Updated sector: ${sectorData.title}`);
    } else {
      // Create new
      result = await makeRequest('/sectors', 'POST', payload);
      console.log(`✅ Created sector: ${sectorData.title}`);
    }
    return result;
    
  } catch (error) {
    console.error(`❌ Failed to create sector ${sectorData.title}:`, error.message);
    return null;
  }
}

async function createAboutPage() {
  console.log('📝 Creating About Page...');
  
  try {
    const aboutData = {
      data: {
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
      }
    };

    const result = await makeRequest('/about-page', 'PUT', aboutData);
    console.log('✅ About page created successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create about page:', error.message);
    return null;
  }
}

async function createContactPage() {
  console.log('📝 Creating Contact Page...');
  
  try {
    const contactData = {
      data: {
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
      }
    };

    const result = await makeRequest('/contact-page', 'PUT', contactData);
    console.log('✅ Contact page created successfully!');
    return result;
    
  } catch (error) {
    console.error('❌ Failed to create contact page:', error.message);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting Complete Content Population');
  console.log('=====================================\n');
  
  let successCount = 0;
  let totalCount = 0;

  // 1. Create Homepage
  console.log('1️⃣ Creating Homepage...');
  totalCount++;
  if (await createHomepage()) successCount++;
  console.log('');

  // 2. Create Services
  console.log('2️⃣ Creating Services...');
  const services = [
    {
      slug: "modulair-bouwen",
      title: "Modulair bouwen",
      category: "DIENST",
      description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules",
      heroTitle: "Wat is modulair bouwen?",
      heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
      metaTitle: "Wat is modulair bouwen? | Envicon",
      metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen."
    },
    {
      slug: "tijdelijke-huisvesting",
      title: "Tijdelijke huisvesting",
      category: "DIENST",
      description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte",
      heroTitle: "Wat is tijdelijke huisvesting?",
      heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.",
      metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
      metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het."
    }
  ];

  for (const service of services) {
    totalCount++;
    if (await createService(service)) successCount++;
  }
  console.log('');

  // 3. Create Sectors
  console.log('3️⃣ Creating Sectors...');
  const sectors = [
    {
      slug: "onderwijs",
      title: "Onderwijs",
      category: "SECTOR",
      description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig.",
      contentTitle: "Tijdelijke onderwijshuisvesting",
      contentSubtitle: "Snel een oplossing voor jouw schoolgebouw"
    },
    {
      slug: "wonen",
      title: "Wonen",
      category: "SECTOR",
      description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten.",
      contentTitle: "Tijdelijke woningen laten bouwen",
      contentSubtitle: "Flexibele woonoplossingen voor diverse situaties"
    },
    {
      slug: "bouw-industrie",
      title: "Bouw & Industrie",
      category: "SECTOR",
      description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie.",
      contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
      contentSubtitle: "Kantoren, werkplaatsen en faciliteiten voor de bouwsector"
    },
    {
      slug: "sport",
      title: "Sport",
      category: "SECTOR",
      description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal.",
      contentTitle: "Tijdelijke sporthal laten bouwen",
      contentSubtitle: "Flexibele sportaccommodaties voor elke gelegenheid"
    }
  ];

  for (const sector of sectors) {
    totalCount++;
    if (await createSector(sector)) successCount++;
  }
  console.log('');

  // 4. Create About Page
  console.log('4️⃣ Creating About Page...');
  totalCount++;
  if (await createAboutPage()) successCount++;
  console.log('');

  // 5. Create Contact Page
  console.log('5️⃣ Creating Contact Page...');
  totalCount++;
  if (await createContactPage()) successCount++;

  console.log('\n🎉 Content Population Completed!');
  console.log('================================');
  console.log(`📊 Success Rate: ${successCount}/${totalCount} items created`);
  
  if (successCount === totalCount) {
    console.log('✅ All content created successfully!');
  } else {
    console.log('⚠️  Some content creation failed. Check the logs above.');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Check content in Strapi admin panel');
  console.log('2. Test API endpoints');
  console.log('3. Add images and media');
  console.log('4. Test your Next.js frontend');
}

main();
