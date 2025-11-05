#!/usr/bin/env node

/**
 * Populate Content Types Based on Checklist Data
 * 
 * This script populates Strapi with content based on the CONTENT_CHECKLIST.md
 * and the RTF file content structure.
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ STRAPI_API_TOKEN environment variable is required');
  console.log('Get your API token from Strapi admin: Settings → API Tokens');
  console.log('Then run: STRAPI_API_TOKEN=your_token node populate-content-from-checklist.js');
  process.exit(1);
}

console.log('📝 Populating Content from Checklist');
console.log('===================================\n');

// Content data based on checklist and RTF file
const contentData = {
  // Homepage content (already exists, but ensure it's complete)
  homepage: {
    heroTitle: "Tijdelijke bouw, permanente kwaliteit",
    heroSubtitle: "Modulaire bouwoplossingen voor onderwijs, wonen, bouw & industrie en sport",
    heroDescription: "Envicon levert hoogwaardige modulaire bouwoplossingen voor tijdelijke huisvesting. Van onderwijsgebouwen tot sportfaciliteiten - wij zorgen voor snelle, flexibele en duurzame oplossingen.",
    heroButton1Text: "Offerte aanvragen",
    heroButton1Url: "/offerte-aanvragen",
    heroButton2Text: "Bekijk projecten",
    heroButton2Url: "/projecten"
  },

  // Services content (Modulair bouwen & Tijdelijke huisvesting)
  services: [
    {
      slug: "modulair-bouwen",
      title: "Modulair bouwen",
      category: "DIENST",
      description: "Flexibele en duurzame modulaire bouwoplossingen voor diverse toepassingen",
      heroTitle: "Modulair bouwen voor elke toepassing",
      heroDescription: "Ontdek de voordelen van modulair bouwen met Envicon. Onze flexibele bouwsystemen bieden snelle, kosteneffectieve en duurzame oplossingen voor tijdelijke en permanente huisvesting.",
      contentBlocks: [
        {
          title: "Wat is modulair bouwen?",
          content: "Modulair bouwen is een innovatieve bouwmethode waarbij gebouwen worden opgebouwd uit vooraf gefabriceerde modules. Deze modules worden in een gecontroleerde omgeving geproduceerd en vervolgens op de bouwlocatie geassembleerd. Dit resulteert in kortere bouwtijden, betere kwaliteitscontrole en meer flexibiliteit in ontwerp en gebruik."
        },
        {
          title: "Voordelen van modulair bouwen",
          content: "Modulair bouwen biedt talloze voordelen: snellere realisatie, lagere kosten, betere kwaliteit door fabrieksproductie, flexibiliteit in ontwerp, herbruikbaarheid van modules, en een kleinere ecologische voetafdruk. Bovendien kunnen modulaire gebouwen eenvoudig worden uitgebreid, verkleind of verplaatst."
        }
      ],
      advantages: [
        {
          icon: "speed",
          title: "Snelle realisatie",
          description: "Tot 50% sneller dan traditionele bouw door parallelle productie en montage"
        },
        {
          icon: "eco",
          title: "Duurzaam",
          description: "Herbruikbare modules en minimaal bouwafval voor een groene toekomst"
        },
        {
          icon: "flexibility",
          title: "Flexibel",
          description: "Eenvoudig uit te breiden, aan te passen of te verplaatsen naar nieuwe locaties"
        }
      ],
      metaTitle: "Modulair bouwen | Flexibele bouwoplossingen | Envicon",
      metaDescription: "Ontdek de voordelen van modulair bouwen met Envicon. Snelle, flexibele en duurzame bouwoplossingen voor elke toepassing. Vraag nu een offerte aan!"
    },
    {
      slug: "tijdelijke-huisvesting",
      title: "Tijdelijke huisvesting",
      category: "DIENST",
      description: "Professionele tijdelijke huisvestingsoplossingen voor diverse sectoren",
      heroTitle: "Tijdelijke huisvesting op maat",
      heroDescription: "Heeft u snel extra ruimte nodig? Envicon levert complete tijdelijke huisvestingsoplossingen voor onderwijs, zorg, kantoren en industrie. Van enkele weken tot meerdere jaren - wij zorgen voor de perfecte oplossing.",
      contentBlocks: [
        {
          title: "Wanneer tijdelijke huisvesting?",
          content: "Tijdelijke huisvesting is de ideale oplossing bij renovaties, uitbreidingen, calamiteiten of tijdelijke capaciteitsproblemen. Onze modulaire units kunnen binnen enkele dagen operationeel zijn en bieden alle comfort en functionaliteit van permanente gebouwen."
        },
        {
          title: "Complete service",
          content: "Wij verzorgen het complete proces: van ontwerp en vergunningen tot levering, montage en onderhoud. Na gebruik kunnen de modules worden gedemonteerd en hergebruikt, wat zorgt voor een duurzame en kosteneffectieve oplossing."
        }
      ],
      advantages: [
        {
          icon: "speed",
          title: "Snel operationeel",
          description: "Binnen enkele dagen tot weken volledig functionele ruimtes"
        },
        {
          icon: "concierge",
          title: "Zorgeloos",
          description: "Wij regelen alles: van vergunningen tot onderhoud en demontage"
        },
        {
          icon: "eco",
          title: "Kosteneffectief",
          description: "Lagere kosten dan nieuwbouw en herbruikbaar voor toekomstige projecten"
        }
      ],
      metaTitle: "Tijdelijke huisvesting | Modulaire units | Envicon",
      metaDescription: "Snel extra ruimte nodig? Envicon levert tijdelijke huisvestingsoplossingen voor onderwijs, zorg en industrie. Zorgeloos van A tot Z. Vraag een offerte!"
    }
  ],

  // Sectors content (from RTF file lines as mentioned in checklist)
  sectors: [
    {
      slug: "onderwijs",
      title: "Onderwijs",
      category: "SECTOR",
      description: "Tijdelijke onderwijshuisvesting voor scholen en onderwijsinstellingen",
      contentTitle: "Tijdelijke onderwijshuisvesting",
      contentSubtitle: "Flexibele klaslokalen en onderwijsfaciliteiten",
      textBlocks: [
        {
          title: "Uitbreiding capaciteit",
          content: "Bij groeiende leerlingenaantallen of renovaties bieden onze modulaire klaslokalen de perfecte oplossing. Volledig uitgeruste onderwijsruimtes die voldoen aan alle eisen voor modern onderwijs."
        },
        {
          title: "Snel operationeel",
          content: "Onze onderwijsmodules kunnen binnen enkele weken worden geplaatst en zijn direct klaar voor gebruik. Minimale verstoring van het onderwijsproces gegarandeerd."
        }
      ],
      features: [
        {
          icon: "school",
          title: "Moderne klaslokalen",
          description: "Volledig uitgeruste lokalen met moderne voorzieningen en technologie"
        },
        {
          icon: "safety",
          title: "Veilig en comfortabel",
          description: "Voldoet aan alle veiligheidseisen en biedt een prettige leeromgeving"
        }
      ]
    },
    {
      slug: "wonen",
      title: "Wonen",
      category: "SECTOR",
      description: "Tijdelijke woningen en woonoplossingen",
      contentTitle: "Tijdelijke woningen laten bouwen",
      contentSubtitle: "Flexibele woonoplossingen voor diverse situaties",
      textBlocks: [
        {
          title: "Tijdelijke woonruimte",
          content: "Voor renovaties, noodsituaties of tijdelijke huisvesting bieden onze modulaire woningen comfort en privacy. Van studio's tot meergezinswoningen - alles is mogelijk."
        },
        {
          title: "Volledig ingericht",
          content: "Onze woonmodules worden compleet geleverd met keuken, badkamer en alle benodigde voorzieningen. Direct bewoonbaar na plaatsing."
        }
      ],
      features: [
        {
          icon: "home",
          title: "Comfortabel wonen",
          description: "Volledig uitgeruste woningen met alle moderne gemakken"
        },
        {
          icon: "flexibility",
          title: "Flexibele oplossingen",
          description: "Van tijdelijke noodhuisvesting tot langdurige woonprojecten"
        }
      ]
    },
    {
      slug: "bouw-industrie",
      title: "Bouw & Industrie",
      category: "SECTOR",
      description: "Tijdelijke huisvesting voor bouw en industrie",
      contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
      contentSubtitle: "Kantoren, werkplaatsen en faciliteiten voor de bouwsector",
      textBlocks: [
        {
          title: "Bouwkantoren en faciliteiten",
          content: "Voor grote bouwprojecten leveren wij complete bouwkantoren, vergaderruimtes, kleedkamers en sanitaire voorzieningen. Alles wat nodig is voor een professionele bouwplaats."
        },
        {
          title: "Industriële toepassingen",
          content: "Ook voor industriële processen bieden onze modules oplossingen: tijdelijke productieruimtes, opslaghallen, laboratoria en kantoorruimtes."
        }
      ],
      features: [
        {
          icon: "construction",
          title: "Bouwplaats faciliteiten",
          description: "Complete voorzieningen voor professionele bouwprojecten"
        },
        {
          icon: "industry",
          title: "Industriële oplossingen",
          description: "Flexibele ruimtes voor productie, opslag en kantoorwerk"
        }
      ]
    },
    {
      slug: "sport",
      title: "Sport",
      category: "SECTOR",
      description: "Tijdelijke sporthallen en sportfaciliteiten",
      contentTitle: "Tijdelijke sporthal laten bouwen",
      contentSubtitle: "Flexibele sportaccommodaties voor elke gelegenheid",
      textBlocks: [
        {
          title: "Sportaccommodaties",
          content: "Bij renovatie van sporthallen of voor tijdelijke evenementen bieden onze modulaire sporthallen de perfecte oplossing. Geschikt voor diverse sporten en activiteiten."
        },
        {
          title: "Complete voorzieningen",
          content: "Onze sporthallen worden geleverd met kleedkamers, doucheruimtes, bergruimtes en alle benodigde sportvoorzieningen. Voldoet aan alle sportbond eisen."
        }
      ],
      features: [
        {
          icon: "sports",
          title: "Professionele sporthallen",
          description: "Modulaire sporthallen geschikt voor alle sporten en evenementen"
        },
        {
          icon: "facilities",
          title: "Complete voorzieningen",
          description: "Inclusief kleedkamers, douches en alle benodigde faciliteiten"
        }
      ]
    }
  ],

  // About page content
  aboutPage: {
    heroTitle: "Tijdelijke bouw, permanente kwaliteit",
    heroDescription: "Envicon is specialist in modulaire bouwoplossingen. Met jarenlange ervaring leveren wij hoogwaardige tijdelijke huisvesting voor diverse sectoren. Ons team van experts zorgt voor maatwerk oplossingen die perfect aansluiten bij uw behoeften.",
    teamTitle: "Het team",
    teamContent: "Ons ervaren team bestaat uit Kyle en Steven, beiden experts in modulaire bouw en projectmanagement. Met hun gecombineerde kennis en ervaring zorgen zij ervoor dat elk project succesvol wordt gerealiseerd, van concept tot oplevering.",
    companyTitle: "Modulair bouwer in Nederland",
    companyContent: "Als toonaangevende modulair bouwer in Nederland ontwikkelen wij innovatieve oplossingen voor tijdelijke huisvesting. Onze focus ligt op kwaliteit, flexibiliteit en duurzaamheid. We werken samen met betrouwbare partners en leveranciers om de beste resultaten te garanderen.",
    certificationsTitle: "Certificeringen & lidmaatschappen",
    certificationsContent: "Envicon beschikt over alle benodigde certificeringen en is lid van relevante brancheverenigingen. Dit garandeert dat onze projecten voldoen aan de hoogste kwaliteits- en veiligheidseisen.",
    ctaTitle: "Op zoek naar een modulair bouwer in Nederland?",
    metaTitle: "Over ons – Envicon – Modulair bouwer",
    metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen. Leer meer over ons team en onze aanpak."
  },

  // Contact page content
  contactPage: {
    heroTitle: "Neem contact op",
    heroDescription: "Heeft u plannen voor tijdelijke bouw of modulaire huisvesting? Neem contact met ons op voor een vrijblijvend adviesgesprek. Wij denken graag mee over de beste oplossing voor uw situatie.",
    benefits: [
      {
        icon: "consultation",
        title: "Gratis adviesgesprek",
        description: "Persoonlijk advies over de beste oplossing voor uw situatie"
      },
      {
        icon: "speed",
        title: "Snelle reactie",
        description: "Binnen 24 uur een reactie op uw aanvraag"
      },
      {
        icon: "expertise",
        title: "Expertise",
        description: "Jarenlange ervaring in modulaire bouw en tijdelijke huisvesting"
      }
    ],
    faqItems: [
      {
        title: "Hoe snel kan een modulair gebouw worden geplaatst?",
        content: "Afhankelijk van de grootte en complexiteit kunnen onze modulaire gebouwen binnen 2-8 weken worden gerealiseerd, van bestelling tot oplevering."
      },
      {
        title: "Zijn modulaire gebouwen geschikt voor langdurig gebruik?",
        content: "Ja, onze modulaire gebouwen zijn ontworpen voor zowel tijdelijk als langdurig gebruik. Ze voldoen aan alle bouwvoorschriften en kunnen jaren meegaan."
      },
      {
        title: "Welke vergunningen zijn nodig?",
        content: "Wij adviseren over de benodigde vergunningen en kunnen u helpen bij het aanvraagproces. Dit verschilt per gemeente en type gebouw."
      },
      {
        title: "Kunnen modulaire gebouwen worden aangepast?",
        content: "Absoluut! Onze modulaire systemen zijn zeer flexibel en kunnen worden aangepast aan uw specifieke wensen en eisen."
      }
    ],
    formTitle: "Contactformulier",
    formDescription: "Vul het formulier in en wij nemen binnen 24 uur contact met u op.",
    metaTitle: "Neem contact op | Envicon",
    metaDescription: "Heb je plannen voor tijdelijke bouw? Bel 085 273 67 54 of mail naar hallo@envicon.nl"
  }
};

async function makeRequest(endpoint, method = 'GET', data = null) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${method} ${endpoint} failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  return response.json();
}

async function createOrUpdateService(serviceData) {
  console.log(`📝 Processing service: ${serviceData.title}`);
  
  try {
    // Check if service exists
    const existing = await makeRequest(`/services?filters[slug][$eq]=${serviceData.slug}`);
    
    const payload = {
      data: {
        ...serviceData,
        publishedAt: new Date().toISOString()
      }
    };

    if (existing.data && existing.data.length > 0) {
      // Update existing
      const result = await makeRequest(`/services/${existing.data[0].id}`, 'PUT', payload);
      console.log(`  ✅ Updated service: ${serviceData.title}`);
      return result;
    } else {
      // Create new
      const result = await makeRequest('/services', 'POST', payload);
      console.log(`  ✅ Created service: ${serviceData.title}`);
      return result;
    }
  } catch (error) {
    console.error(`  ❌ Failed to process service ${serviceData.title}:`, error.message);
    throw error;
  }
}

async function createOrUpdateSector(sectorData) {
  console.log(`📝 Processing sector: ${sectorData.title}`);
  
  try {
    // Check if sector exists
    const existing = await makeRequest(`/sectors?filters[slug][$eq]=${sectorData.slug}`);
    
    const payload = {
      data: {
        ...sectorData,
        publishedAt: new Date().toISOString()
      }
    };

    if (existing.data && existing.data.length > 0) {
      // Update existing
      const result = await makeRequest(`/sectors/${existing.data[0].id}`, 'PUT', payload);
      console.log(`  ✅ Updated sector: ${sectorData.title}`);
      return result;
    } else {
      // Create new
      const result = await makeRequest('/sectors', 'POST', payload);
      console.log(`  ✅ Created sector: ${sectorData.title}`);
      return result;
    }
  } catch (error) {
    console.error(`  ❌ Failed to process sector ${sectorData.title}:`, error.message);
    throw error;
  }
}

async function updateSingleType(endpoint, data, name) {
  console.log(`📝 Updating ${name}...`);
  
  try {
    const payload = {
      data: {
        ...data,
        publishedAt: new Date().toISOString()
      }
    };

    const result = await makeRequest(endpoint, 'PUT', payload);
    console.log(`  ✅ Updated ${name}`);
    return result;
  } catch (error) {
    console.error(`  ❌ Failed to update ${name}:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🔍 Testing API connection...');
    await makeRequest('/homepage');
    console.log('✅ API connection successful\n');

    // 1. Update homepage
    console.log('1️⃣ Updating homepage...');
    await updateSingleType('/homepage', contentData.homepage, 'Homepage');

    // 2. Create/update services
    console.log('\n2️⃣ Processing services...');
    for (const service of contentData.services) {
      await createOrUpdateService(service);
    }

    // 3. Create/update sectors
    console.log('\n3️⃣ Processing sectors...');
    for (const sector of contentData.sectors) {
      await createOrUpdateSector(sector);
    }

    // 4. Update about page
    console.log('\n4️⃣ Updating about page...');
    await updateSingleType('/about-page', contentData.aboutPage, 'About Page');

    // 5. Update contact page
    console.log('\n5️⃣ Updating contact page...');
    await updateSingleType('/contact-page', contentData.contactPage, 'Contact Page');

    console.log('\n🎉 Content population completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  ✅ Homepage updated`);
    console.log(`  ✅ ${contentData.services.length} services processed`);
    console.log(`  ✅ ${contentData.sectors.length} sectors processed`);
    console.log(`  ✅ About page updated`);
    console.log(`  ✅ Contact page updated`);
    
    console.log('\n🔗 Next steps:');
    console.log('1. Check content in Strapi admin panel');
    console.log('2. Add images/media to content');
    console.log('3. Test your Next.js frontend');
    console.log('4. Add more projects and articles as needed');

  } catch (error) {
    console.error('\n❌ Content population failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { main, contentData };
