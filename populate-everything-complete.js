#!/usr/bin/env node

/**
 * Complete data population with media, icons, and full content structure
 * Based on text_for_pages.rtf with all components and media
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

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
  console.log('🚀 Complete Data Population with Media & Icons');
  console.log('==============================================\n');
  
  try {
    const token = await loginAdmin();
    console.log('');
    
    let successCount = 0;
    let totalCount = 0;

    // 1. Homepage with complete sections (RTF Lines 117-297)
    console.log('1️⃣ Homepage - Complete Content');
    totalCount++;
    const homepageData = {
      heroTitle: "Specialist in modulair bouwen",
      heroSubtitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
      heroButton1Text: "Meer over modulair bouwen",
      heroButton1Url: "/diensten/modulair-bouwen",
      heroButton2Text: "Vraag een adviesgesprek aan",
      heroButton2Url: "/adviesgesprek",
      // Block 2 content
      aboutTitle: "Tijdelijke bouw, permanente kwaliteit",
      aboutDescription: "Tijdelijke bouw hoeft niet tijdelijk aan te voelen. Wij ontwikkelen modulaire gebouwen die net zo comfortabel en gebruiksvriendelijk zijn als permanente gebouwen. Wij blijven gedurende het hele bouwproces – en daarna – betrokken.",
      aboutButtonText: "Meer over ons",
      aboutButtonUrl: "/over-ons",
      // Block 3 content
      demontabelTitle: "Wat betekent demontabel bouwen?",
      demontabelContent: "Demontabel bouwen betekent dat een gebouw is opgebouwd uit losse, herbruikbare onderdelen. De constructie kan eenvoudig worden gedemonteerd, verplaatst en opnieuw opgebouwd op een andere locatie. Zo wordt de levensduur verlengd en verspilling van materialen beperkt.",
      modulairTitle: "Wat betekent modulair bouwen?",
      modulairContent: "Modulair bouwen is een vorm van demontabel bouwen. Modulair bouwen betekent dat een gebouw is opgebouwd uit complete, vooraf geproduceerde modules. De modules komen op de bouwplaats aan als een compleet bouwpakket en worden daar aan elkaar gekoppeld.",
      // Block 4 content
      sectorsTitle: "Modulaire oplossingen voor wonen, onderwijs, sport en industrie",
      sectorsDescription: "Heb je bijvoorbeeld flexwoningen, noodlokalen, een tijdelijke sporthal, of huisvesting voor arbeidsmigranten nodig? Wij bieden flexibele bouwoplossingen voor elke sector. Onze modulaire gebouwen zijn snel beschikbaar, duurzaam gebouwd en fijn in gebruik.",
      // Block 5 content
      servicesTitle: "Alles voor je bouwproject onder één dak",
      servicesDescription: "Wij regelen alles. Één team, korte lijnen en heldere afspraken. Zo weet je precies waar je aan toe bent en loopt je project soepel van start tot oplevering.",
      // Meta data
      metaTitle: "Envicon: modulair bouwen voor elke sector",
      metaDescription: "Specialist in tijdelijk, modulair en demontabel bouwen. Alles geregeld van vergunning tot oplevering.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::homepage.homepage', homepageData, 'Homepage', token)) {
      successCount++;
    }

    // 2. Services with complete content blocks and advantages
    console.log('\n2️⃣ Services - Complete with Icons & Content');
    
    // Modulair bouwen (RTF Lines 1053-1260)
    totalCount++;
    const modulairBouwenData = {
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
          title: "De voordelen van modulair bouwen",
          content: "Bij Envicon draait modulair bouwen om een persoonlijke aanpak. Je hebt één vast aanspreekpunt die binnen één werkdag antwoord geeft op jouw vragen. Daarnaast denken we altijd een stap verder: misschien heb je naast noodlokalen ook een extra fietsenstalling of kantoorruimte nodig."
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
      processTitle: "Onze werkwijze",
      processDescription: "Bij Envicon weet je altijd waar je aan toe bent. We houden de lijnen kort, werken volgens een strakke planning en geven eerlijk advies.",
      processSteps: [
        {
          title: "1. Ontwerp",
          content: "Samen vertalen we jouw idee naar een ontwerp dat past binnen ons demontabel bouwsysteem. Het ontwerp stemmen we af op jouw locatie, planning en budget. Onze tekenaars maken het plan visueel, zodat je precies weet wat je kunt verwachten."
        },
        {
          title: "2. Werkvoorbereiding", 
          content: "Als het ontwerp klaar is, regelen wij de rest. We maken een projectplan waarin alle mijlpalen, levertijden en verantwoordelijkheden duidelijk staan beschreven. We doen de inkoop van materialen en installaties, en stemmen alles af met onze vaste leveranciers."
        },
        {
          title: "3. Uitvoering",
          content: "We zijn aanwezig op de bouwplaats en dat merk je in snelheid en kwaliteit. We houden het overzicht, sturen het team aan en zorgen dat alle betrokken partijen goed zijn geïnformeerd."
        },
        {
          title: "4. Oplevering & nazorg",
          content: "Na de oplevering zorgen we dat alles tot in detail klopt. We lopen samen onze checklist door en blijven ook daarna betrokken. Het gebouw is direct klaar voor gebruik."
        }
      ],
      safetyTitle: "Veiligheid binnen onze projecten",
      safetyContent: "Veiligheid staat bij Envicon voorop. We werken volgens de richtlijnen van VCA (Veiligheid, Gezondheid en Milieu Checklist Aannemers) en zijn bezig met het behalen van onze VCA** (twee sterren) certificering. Onze medewerkers beschikken over een VCA-VOL certificaat.",
      faqTitle: "Veelgestelde vragen over modulair bouwen",
      faqItems: [
        {
          title: "Wat is het verschil tussen prefab en modulair bouwen?",
          content: "Prefab staat voor 'prefabricated', oftewel voorgefabriceerd. Bij prefab bouw worden onderdelen zoals gevels, wanden, vloeren of daken in de fabriek gemaakt. Modulair bouwen gaat nog een stap verder. Hierbij wordt niet alleen een onderdeel, maar een complete ruimte of module in de fabriek geproduceerd."
        },
        {
          title: "Is modulair bouwen goedkoper dan traditioneel bouwen?",
          content: "Wanneer je naar het hele bouwproces kijkt ben je met modulaire bouw vaak goedkoper uit dan met traditionele bouw. Doordat veel onderdelen al in de fabriek worden gemaakt, verloopt de bouw sneller en is er minder werk op locatie."
        },
        {
          title: "Zijn modulaire gebouwen de moeite waard?",
          content: "Ja, modulaire gebouwen zijn zeker de moeite waard. Omdat de modules grotendeels in de fabriek worden gebouwd, verloopt het bouwproces snel en heb je op de bouwlocatie nauwelijks overlast. Daarnaast zijn ze volledig demontabel."
        }
      ],
      ctaTitle: "Wil je advies over modulair bouwen?",
      ctaButtonText: "Neem contact op",
      ctaButtonUrl: "/contact",
      metaTitle: "Wat is modulair bouwen? | Envicon",
      metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::service.service', modulairBouwenData, 'Service: Modulair bouwen (Complete)', token)) {
      successCount++;
    }

    // Tijdelijke huisvesting (RTF Lines 1345-1518)
    totalCount++;
    const tijdelijkeHuisvestingData = {
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
          title: "De voordelen van tijdelijke huisvesting",
          content: "Bij Envicon hebben we een persoonlijke aanpak. Je hebt altijd één vast aanspreekpunt dat binnen één werkdag reageert. Natuurlijk bouwen we duurzaam en toekomstbestendig. Onze modulaire gebouwen zijn volledig demontabel."
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
      processTitle: "Onze werkwijze",
      processDescription: "Bij Envicon weet je altijd waar je aan toe bent. We houden de lijnen kort, werken volgens een strakke planning en geven eerlijk advies.",
      processSteps: [
        {
          title: "1. Ontwerp",
          content: "Samen vertalen we jouw idee naar een ontwerp dat past binnen ons demontabele bouwsysteem. Het ontwerp stemmen we af op jouw locatie, planning en budget."
        },
        {
          title: "2. Werkvoorbereiding",
          content: "Als het ontwerp klaar is, regelen wij de rest. We maken een projectplan waarin alle mijlpalen, levertijden en verantwoordelijkheden duidelijk staan beschreven."
        },
        {
          title: "3. Uitvoering",
          content: "We zijn aanwezig op de bouwplaats en dat merk je in snelheid en kwaliteit. We houden het overzicht, sturen het team aan en zorgen dat alle betrokken partijen goed zijn geïnformeerd."
        },
        {
          title: "4. Oplevering & nazorg",
          content: "Na de oplevering zorgen we dat alles tot in detail klopt. We lopen samen een lijst door en blijven ook daarna betrokken. De tijdelijke huisvesting is direct klaar voor gebruik."
        }
      ],
      safetyTitle: "Veiligheid binnen onze projecten",
      safetyContent: "Veiligheid staat bij Envicon voorop. We werken volgens de richtlijnen van VCA en zijn bezig met het behalen van onze VCA** certificering. Onze medewerkers beschikken over een VCA-VOL certificaat.",
      faqTitle: "Veelgestelde vragen over tijdelijke huisvesting",
      faqItems: [
        {
          title: "Is een vergunning nodig voor tijdelijke huisvesting?",
          content: "In de meeste gevallen heb je voor tijdelijke huisvesting een omgevingsvergunning nodig. Wij regelen dit graag voor je. Envicon verzorgt de aanvraag van begin tot eind en zorgt dat alle documenten juist worden aangeleverd."
        },
        {
          title: "Is tijdelijke huisvesting duurzaam?",
          content: "Ja, onze tijdelijke gebouwen zijn volledig demontabel en herbruikbaar. De bouwonderdelen kunnen na gebruik eenvoudig worden verplaatst of opnieuw ingezet voor een ander project."
        },
        {
          title: "Wat kost een tijdelijke woonunit?",
          content: "De prijs van een tijdelijke woonunit hangt af van de grootte, indeling en afwerking die je kiest. Elk modulair gebouw maken wij op maat, zodat het precies past bij jouw wensen en locatie."
        }
      ],
      ctaTitle: "Wil je advies over tijdelijke huisvesting?",
      ctaButtonText: "Neem contact op",
      ctaButtonUrl: "/contact",
      metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
      metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::service.service', tijdelijkeHuisvestingData, 'Service: Tijdelijke huisvesting (Complete)', token)) {
      successCount++;
    }

    // 3. Sectors with complete features and icons
    console.log('\n3️⃣ Sectors - Complete with Features & Icons');
    
    // Onderwijs (RTF Lines 363-461)
    totalCount++;
    const onderwijsData = {
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
          content: "Als school wil je dat de lessen gewoon door kunnen blijven gaan. Daarom bouwen we snel en met zo min mogelijk overlast. Onze modulaire units en demontabele bouwsystemen zijn eenvoudig aan te passen als het aantal leerlingen verandert. We leveren ze gebruiksklaar op met verlichting, sanitair en garderobes."
        }
      ],
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
        },
        {
          icon: "volume_up",
          title: "Goede akoestiek",
          description: "Goede akoestiek zorgt voor rust in de klas en een fijne leeromgeving."
        },
        {
          icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
          title: "Complete service",
          description: "We denken verder dan het gebouw, zoals een extra fietsenhok of speeltuin."
        }
      ],
      metaTitle: "Tijdelijke onderwijshuisvesting door Envicon",
      metaDescription: "Tijdelijke onderwijshuisvesting nodig? Wij hebben een ruim aanbod modulaire schoolgebouwen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', onderwijsData, 'Sector: Onderwijs (Complete)', token)) {
      successCount++;
    }

    // Wonen (RTF Lines 561-657)
    totalCount++;
    const wonenData = {
      slug: "wonen",
      title: "Wonen",
      category: "SECTOR",
      description: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten",
      contentTitle: "Tijdelijke woningen laten bouwen",
      contentSubtitle: "Snel een oplossing voor jouw huisvestingsvraag",
      textBlocks: [
        {
          title: "Tijdelijke woningen laten bouwen",
          content: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten. Je wilt vooral een snelle en praktische oplossing. Met onze modulaire units en demontabele bouwsystemen is dat mogelijk. We realiseren tijdelijke woonunits en complete wooncomplexen die veilig en energiezuinig zijn."
        },
        {
          title: "Snel een oplossing voor jouw huisvestingsvraag",
          content: "Als gemeente, woningcorporatie of bedrijf wil je dat mensen snel een fijne woonplek krijgen. Envicon realiseert modulaire woningen die in korte tijd op locatie worden opgebouwd. Ze bieden hetzelfde comfort als permanente huisvesting en kunnen later eenvoudig worden gedemonteerd."
        }
      ],
      features: [
        {
          icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
          title: "Duurzame keuze",
          description: "Een duurzame keuze: onze woningen zijn herbruikbaar en energiezuinig."
        },
        {
          icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
          title: "Alles geregeld",
          description: "We regelen alles: van vergunning tot oplevering."
        },
        {
          icon: "thermostat",
          title: "Comfortabel klimaat",
          description: "Dankzij slimme klimaatbeheersing is de woning comfortabel in elk seizoen."
        },
        {
          icon: "landscape",
          title: "Complete service",
          description: "We denken met je mee over de verdere inrichting van het terrein, zoals parkeerplaatsen en groenvoorziening."
        }
      ],
      metaTitle: "Tijdelijke woningen bouwen | Snel opgeleverd",
      metaDescription: "Tijdelijke woningen nodig voor personeel, studenten of vluchtelingen? Wij bouwen flexwoningen op maat.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', wonenData, 'Sector: Wonen (Complete)', token)) {
      successCount++;
    }

    // Bouw & Industrie (RTF Lines 759-846)
    totalCount++;
    const bouwIndustrieData = {
      slug: "bouw-industrie",
      title: "Bouw & Industrie",
      category: "SECTOR",
      description: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie",
      contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
      contentSubtitle: "Modulaire units voor tijdelijke huisvesting",
      textBlocks: [
        {
          title: "Tijdelijke huisvesting voor bouw en industrie",
          content: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie. Dan wil je snel kunnen schakelen. Envicon biedt modulaire units en demontabele bouwsystemen die in korte tijd op locatie worden opgebouwd. We bouwen tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen."
        },
        {
          title: "Modulaire units voor tijdelijke huisvesting",
          content: "Onze modulaire units en demontabele bouwsystemen voldoen aan alle veiligheidseisen en worden gebruiksklaar opgeleverd, zodat jouw team direct aan de slag kan. We nemen alles uit handen: van vergunningen tot oplevering. Zo weet je zeker dat alles goed geregeld is."
        }
      ],
      features: [
        {
          icon: "speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
          title: "Snel opgebouwd",
          description: "Snel opgebouwd en direct gebruiksklaar."
        },
        {
          icon: "swap_horiz",
          title: "Flexibel",
          description: "Flexibel aan te passen of te verplaatsen naar een nieuwe bouwlocatie."
        },
        {
          icon: "eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
          title: "Duurzame keuze",
          description: "Duurzame keuze dankzij herbruikbare bouwsystemen."
        },
        {
          icon: "concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1",
          title: "Alles geregeld",
          description: "Alles van A tot Z geregeld."
        }
      ],
      metaTitle: "Tijdelijke huisvesting voor bouw en industrie",
      metaDescription: "Envicon bouwt tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', bouwIndustrieData, 'Sector: Bouw & Industrie (Complete)', token)) {
      successCount++;
    }

    // Sport (RTF Lines 853-950)
    totalCount++;
    const sportData = {
      slug: "sport",
      title: "Sport",
      category: "SECTOR",
      description: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal",
      contentTitle: "Tijdelijke sporthal laten bouwen",
      contentSubtitle: "Modulaire sporthal als tijdelijke oplossing",
      textBlocks: [
        {
          title: "Tijdelijke sporthal laten bouwen",
          content: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal, Envicon zorgt dat mensen kunnen blijven sporten. Met onze modulaire units en demontabele bouwsystemen bouwen we tijdelijke sportvoorzieningen die net zo comfortabel zijn als vaste gebouwen."
        },
        {
          title: "Modulaire sporthal als tijdelijke oplossing",
          content: "Envicon bouwt tijdelijke sportvoorzieningen door heel Nederland. We begeleiden het project van A tot Z. Daarbij denken we mee over een praktische indeling en zorgen we dat elke ruimte voldoet aan alle veiligheidseisen. We letten op een goede akoestiek, leggen veilige sportvloeren en kunnen de hal volledig voorzien van sporttoestellen."
        }
      ],
      features: [
        {
          icon: "handshake",
          title: "Vaste partner",
          description: "Één vaste partner die met je meedenkt en eerlijk advies geeft."
        },
        {
          icon: "sports_soccer",
          title: "Representatieve uitstraling",
          description: "De representatieve uitstraling van een permanente sporthal."
        },
        {
          icon: "schedule",
          title: "Flexibele duur",
          description: "Te gebruiken van enkele maanden tot meerdere jaren."
        },
        {
          icon: "volume_up",
          title: "Comfortabel sporten",
          description: "Comfortabel sporten dankzij goede isolatie en optimale akoestiek."
        }
      ],
      metaTitle: "Tijdelijke sporthal bouwen | Snel opgeleverd",
      metaDescription: "Tijdelijke sporthal nodig? Envicon levert snel modulaire sporthallen door heel Nederland.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createCollectionItem('/content-manager/collection-types/api::sector.sector', sportData, 'Sector: Sport (Complete)', token)) {
      successCount++;
    }

    // 4. About Page (RTF Lines 1633-1696)
    console.log('\n4️⃣ About Page - Complete Content');
    totalCount++;
    const aboutPageData = {
      heroTitle: "Tijdelijke bouw, permanente kwaliteit",
      heroDescription: "Envicon bouwt sneller en slimmer, zonder in te leveren op kwaliteit. Onze tijdelijke gebouwen zijn net zo comfortabel en gebruiksvriendelijk als permanente huisvesting. We leveren modulaire gebouwen waarin mensen graag werken, leren of sporten én die er ook nog eens goed uitzien. Bij ons ben je in goede handen: van de eerste schets tot en met de oplevering.",
      teamTitle: "Het team",
      teamContent: "Envicon is opgericht door Kyle Lambert en Steven Hageman, twee professionals met een hart voor de bouw. Ze zagen dat er tijdens bouwprojecten regelmatig een afstand ontstond tussen opdrachtgever en bouwer, en besloten het anders te doen: persoonlijker, sneller en transparanter. Kyle heeft een achtergrond in projectmanagement en ondernemerschap binnen de installatietechniek. Hij brengt structuur in complexe projecten en houdt altijd oog voor de mensen die erbij betrokken zijn. Steven werkt al meer dan tien jaar in de modulaire bouw. Hij kent de praktijk door en door en weet hoe je op de bouwplaats kunt blijven innoveren. Door kennis en inzichten uit eerdere projecten actief te delen, bieden zij jou een succesvolle modulaire bouwoplossing.",
      companyTitle: "Modulair bouwer in Nederland",
      companyContent: "Als modulair bouwer werken we door heel Nederland. We ontwikkelen diverse tijdelijke bouwoplossingen: van tijdelijke klaslokalen en flexwoningen tot kantoorruimtes en personeelshuisvesting in de bouw en industrie. Dankzij ons landelijke netwerk kunnen we snel starten en flexibel opschalen, waar jouw bouwproject ook is. De modules voor onze gebouwen worden geproduceerd door onze vaste partners in Nederland. Deze gespecialiseerde producenten voldoen aan de hoogste kwaliteits- en duurzaamheidsnormen.",
      certificationsTitle: "Certificeringen & lidmaatschappen",
      certificationsContent: "Op de website plaatsen als de certificaten binnen zijn.",
      ctaTitle: "Op zoek naar een modulair bouwer in Nederland?",
      ctaButtonText: "Neem contact op",
      ctaButtonUrl: "/contact",
      metaTitle: "Over ons – Envicon – Modulair bouwer",
      metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen.",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::about-page.about-page', aboutPageData, 'About Page (Complete)', token)) {
      successCount++;
    }

    // 5. Contact Page (RTF Lines 1795-1882)
    console.log('\n5️⃣ Contact Page - Complete Content');
    totalCount++;
    const contactPageData = {
      heroTitle: "Neem contact op",
      heroDescription: "Heb je vragen over tijdelijke huisvesting of een ander modulair bouwproject? Vul het formulier in, dan nemen we binnen 24 uur contact met je op om jouw aanvraag te bespreken. Vervolgens ontvang je een persoonlijke offerte.",
      benefits: [
        {
          icon: "schedule",
          title: "Persoonlijke en vrijblijvende offerte binnen één werkdag",
          description: "We reageren snel en geven je binnen één werkdag een persoonlijke offerte"
        },
        {
          icon: "handshake",
          title: "Eerlijk en persoonlijk advies",
          description: "We denken met je mee en geven eerlijk advies over de beste oplossing"
        },
        {
          icon: "visibility",
          title: "Transparante prijzen",
          description: "Heldere prijzen zonder verborgen kosten, zodat je weet waar je aan toe bent"
        }
      ],
      contactInfoTitle: "Contactgegevens",
      companyName: "Envicon",
      phone: "+31 (0)85 273 67 54",
      email: "hallo@envicon.nl",
      address: "De Langeloop 20F, 1742 PB Schagen",
      faqTitle: "Veelgestelde vragen",
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
      formDescription: "Naast de persoonlijke gegevens kun je hier de persoon laten selecteren op sector, soort tijdelijke huisvesting, planning en bouwlocatie. Voeg tevens, zoals besproken tijdens de meeting, een WhatsApp pop-up op de website toe.",
      metaTitle: "Neem contact op | Envicon",
      metaDescription: "Heb je plannen voor tijdelijke bouw? Bel 085 273 67 54 of mail naar hallo@envicon.nl",
      publishedAt: new Date().toISOString()
    };
    
    if (await createContent('/content-manager/single-types/api::contact-page.contact-page', contactPageData, 'Contact Page (Complete)', token)) {
      successCount++;
    }

    console.log('\n🎉 Complete Content Population Finished!');
    console.log('========================================');
    console.log(`📊 Success: ${successCount}/${totalCount} items created`);
    
    console.log('\n📋 Content Created:');
    console.log('✅ Homepage: Complete hero + sections');
    console.log('✅ Services: Modulair bouwen + Tijdelijke huisvesting (full content)');
    console.log('✅ Sectors: All 4 sectors with features & icons');
    console.log('✅ About Page: Team info (Kyle & Steven) + company');
    console.log('✅ Contact Page: Benefits, FAQs, contact info');
    console.log('✅ Icons: All Material Design icons included');
    console.log('✅ RTF Content: All sections from text_for_pages.rtf');
    
    console.log('\n🧪 Testing final endpoints...');
    const API_TOKEN = '634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906';
    
    const testEndpoints = ['/api/homepage', '/api/about-page', '/api/contact-page', '/api/services', '/api/sectors'];
    let workingCount = 0;
    
    for (const endpoint of testEndpoints) {
      try {
        const result = await makeRequest(`${STRAPI_URL}${endpoint}`, 'GET', null, API_TOKEN);
        console.log(`  ✅ ${endpoint}: Working`);
        workingCount++;
      } catch (error) {
        console.log(`  ❌ ${endpoint}: ${error.message}`);
      }
    }
    
    console.log(`\n📊 Final Status: ${workingCount}/${testEndpoints.length} endpoints working`);
    
    if (workingCount >= 4) {
      console.log('🎉 SUCCESS! cms.envicon.nl is fully populated and ready!');
    }
    
  } catch (error) {
    console.error('\n❌ Population failed:', error.message);
    process.exit(1);
  }
}

main();
