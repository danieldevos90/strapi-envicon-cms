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
  // Homepage content (from RTF file - Blok 1)
  homepage: {
    heroTitle: "Specialist in modulair bouwen",
    heroSubtitle: "Tijdelijke bouw, permanente kwaliteit",
    heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
    heroButton1Text: "Meer over modulair bouwen",
    heroButton1Url: "/diensten/modulair-bouwen",
    heroButton2Text: "Vraag een adviesgesprek aan",
    heroButton2Url: "/adviesgesprek"
  },

  // Services content (Modulair bouwen & Tijdelijke huisvesting)
  services: [
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
        },
        {
          title: "Duurzaam en toekomstbestendig",
          content: "Bij Envicon draait modulair bouwen om een persoonlijke aanpak. Je hebt één vast aanspreekpunt die binnen één werkdag antwoord geeft op jouw vragen. Natuurlijk bouwen we duurzaam en toekomstbestendig. Onze modulaire gebouwen zijn demontabel, energiezuinig en kunnen ontworpen worden volgens de BENG-normen."
        }
      ],
      advantages: [
        {
          icon: "speed",
          title: "Snel gebouwd, minimale overlast",
          description: "Omdat we de bouwonderdelen grotendeels in de werkplaats voorbereiden, kunnen we op locatie snel en efficiënt werken. Zo beperken we de bouwtijd én de overlast op de bouwplaats."
        },
        {
          icon: "eco",
          title: "Circulair en toekomstbestendig",
          description: "Onze bouwsystemen zijn volledig demontabel. De onderdelen kunnen na gebruik makkelijk uit elkaar worden gehaald en worden ingezet bij een ander bouwproject."
        },
        {
          icon: "flexibility",
          title: "Flexibel in ontwerp",
          description: "We ontwerpen elke modulaire unit of demontabel bouwsysteem precies zoals jij het wilt, passend bij de locatie en het gebruik."
        }
      ],
      metaTitle: "Modulair bouwen | Flexibele bouwoplossingen | Envicon",
      metaDescription: "Ontdek de voordelen van modulair bouwen met Envicon. Snelle, flexibele en duurzame bouwoplossingen voor elke toepassing. Vraag nu een offerte aan!"
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
        },
        {
          title: "Duurzaam en toekomstbestendig",
          content: "Bij Envicon hebben we een persoonlijke aanpak. Je hebt altijd één vast aanspreekpunt dat binnen één werkdag reageert. Natuurlijk bouwen we duurzaam en toekomstbestendig. Onze modulaire gebouwen zijn volledig demontabel en energiezuinig."
        }
      ],
      advantages: [
        {
          icon: "speed",
          title: "Snel inzetbaar bij urgente huisvestingsvragen",
          description: "Heb je op korte termijn extra ruimte nodig? We bereiden de bouwonderdelen grotendeels voor in onze eigen werkplaats. Daardoor is de montage op locatie een kwestie van weken in plaats van maanden."
        },
        {
          icon: "eco",
          title: "Verplaatsbaar en herbruikbaar",
          description: "Onze gebouwen zijn volledig demontabel. Wanneer jij de tijdelijke huisvesting niet meer nodig hebt, verplaatsen we het gebouw snel en eenvoudig naar een andere plek."
        },
        {
          icon: "flexibility",
          title: "Flexibel in ontwerp",
          description: "Waar standaard prefab units vaste afmetingen hebben, passen wij elk gebouw volledig aan op jouw wensen en locatie. Ook tijdelijke huisvesting krijgt bij ons de uitstraling van een permanente oplossing."
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
      description: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig.",
      contentTitle: "Tijdelijke onderwijshuisvesting",
      contentSubtitle: "Snel een oplossing voor jouw schoolgebouw",
      textBlocks: [
        {
          title: "Tijdelijke onderwijshuisvesting",
          content: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig. We bouwen tijdelijke klaslokalen, kantines, gymzalen en complete schoolgebouwen voor kindcentra, basisscholen, middelbare scholen en universiteiten. Onze modulaire units en demontabele bouwsystemen zijn veilig en voelen aan als een permanent schoolgebouw: een plek waar leerlingen prettig kunnen leren."
        },
        {
          title: "Snel een oplossing voor jouw schoolgebouw",
          content: "Als school wil je dat de lessen gewoon door kunnen blijven gaan. Daarom bouwen we snel en met zo min mogelijk overlast. Onze modulaire units en demontabele bouwsystemen zijn eenvoudig aan te passen als het aantal leerlingen verandert. We leveren ze gebruiksklaar op met verlichting, sanitair en garderobes. De tijdelijke gebouwen kunnen wij realiseren volgens het Programma van Eisen Frisse Scholen (klasse B of C)."
        }
      ],
      features: [
        {
          icon: "school",
          title: "Flexibel inzetbaar",
          description: "Onze modulaire gebouwen zijn flexibel inzetbaar: als uitbreiding van een permanent schoolgebouw of dependance."
        },
        {
          icon: "eco",
          title: "Comfortabel klimaat",
          description: "Dankzij slimme klimaatbeheersing is de ruimte comfortabel in elk seizoen."
        },
        {
          icon: "safety",
          title: "Goede akoestiek",
          description: "Goede akoestiek zorgt voor rust in de klas en een fijne leeromgeving."
        },
        {
          icon: "concierge",
          title: "Complete service",
          description: "We denken verder dan het gebouw, zoals een extra fietsenhok of speeltuin."
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

  // About page content (from RTF file)
  aboutPage: {
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
    metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen."
  },

  // Contact page content (from RTF file)
  contactPage: {
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
    try {
      await makeRequest('/homepage');
      console.log('✅ API connection successful\n');
    } catch (error) {
      if (error.message.includes('404')) {
        console.log('✅ API connection successful (content will be created)\n');
      } else {
        throw error;
      }
    }

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
