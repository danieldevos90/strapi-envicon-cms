/**
 * Import RTF Content to Strapi
 * 
 * This script imports all the content from text_for_pages.rtf into Strapi CMS
 * Run with: STRAPI_API_TOKEN=your_token node import-rtf-content.js
 */

const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is required');
  console.log('Usage: STRAPI_API_TOKEN=your_token node import-rtf-content.js');
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Utility functions
async function findOrCreateEntry(contentType, data, identifier = 'title') {
  try {
    const response = await apiClient.get(`/api/${contentType}?filters[${identifier}][$eq]=${data[identifier]}`);
    if (response.data.data && response.data.data.length > 0) {
      // Update existing
      const id = response.data.data[0].id;
      console.log(`  📝 Updating existing ${contentType}: ${data[identifier]}`);
      await apiClient.put(`/api/${contentType}/${id}`, { data });
      return response.data.data[0];
    } else {
      // Create new
      console.log(`  ✨ Creating new ${contentType}: ${data[identifier]}`);
      const createResponse = await apiClient.post(`/api/${contentType}`, { data });
      return createResponse.data.data;
    }
  } catch (error) {
    console.error(`❌ Error with ${contentType}:`, error.response?.data || error.message);
    throw error;
  }
}

async function updateSingleType(contentType, data) {
  try {
    console.log(`  📝 Updating ${contentType}...`);
    await apiClient.put(`/api/${contentType}`, { data });
    console.log(`  ✅ Updated ${contentType}`);
  } catch (error) {
    console.error(`❌ Error updating ${contentType}:`, error.response?.data || error.message);
  }
}

// Content Data from RTF file
const content = {
  homepage: {
    hero: {
      title: "Specialist in modulair bouwen",
      subtitle: "ENVICON",
      description: "Envicon ontwikkelt tijdelijke en modulaire gebouwen. Of het nu gaat om extra klaslokalen, kantoorruimtes, tijdelijke woningen of personeelshuisvesting, wij regelen alles van vergunning tot oplevering. Met snelle communicatie en persoonlijke begeleiding zorgen we dat jouw project soepel verloopt.",
      buttons: [
        {
          text: "Meer over modulair bouwen",
          href: "/diensten/modulair-bouwen",
          variant: "primary"
        },
        {
          text: "Vraag een adviesgesprek aan",
          href: "/adviesgesprek",
          variant: "secondary"
        }
      ]
    },
    about: {
      subtitle: "OVER ENVICON",
      title: "Tijdelijke bouw, permanente kwaliteit",
      description: "Tijdelijke bouw hoeft niet tijdelijk aan te voelen. Wij ontwikkelen modulaire gebouwen die net zo comfortabel en gebruiksvriendelijk zijn als permanente gebouwen.\n\nWij blijven gedurende het hele bouwproces – en daarna – betrokken. Ontstaat er tijdens het bouwproces een aanvullende vraag? Denk bijvoorbeeld aan de plaatsing van een fietsenstalling naast een tijdelijk klaslokaal. Dan regelen we dat! Heb je vragen over vergunningen of elektra? We geven eerlijk advies en zoeken samen naar de beste oplossing.",
      features: [
        {
          icon: "check_circle",
          title: "Alles geregeld van de eerste schets tot de oplevering",
          description: "Eén team dat alles uit handen neemt"
        },
        {
          icon: "tune",
          title: "Flexibele bouwoplossingen die passen bij jouw wensen en locatie",
          description: "Maatwerk voor elke situatie"
        },
        {
          icon: "handshake",
          title: "Eén vaste partner die met je meedenkt en eerlijk advies geeft",
          description: "Persoonlijke begeleiding"
        },
        {
          icon: "speed",
          title: "Korte lijnen zodat je geen onnodige vertraging oploopt",
          description: "Snelle communicatie"
        }
      ]
    }
  },
  
  services: [
    {
      slug: "modulair-bouwen",
      title: "Modulair bouwen",
      category: "DIENST",
      description: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.",
      order: 1,
      heroTitle: "Wat is modulair bouwen?",
      heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.\n\nModulair bouwen is een vorm van demontabel bouwen. De modules kunnen eenvoudig worden gedemonteerd, verplaatst en hergebruikt. Het is een flexibele en duurzame bouwoplossing die meebeweegt met jouw behoeften.",
      heroButton1Text: "Neem contact op",
      heroButton1Url: "/contact",
      contentBlocks: [
        {
          title: "Persoonlijk advies over jouw modulair bouwproject",
          content: "Elk bouwproject is anders, dus kijken we samen naar wat er nodig is. Dankzij onze flexibele bouwsystemen leveren we altijd maatwerk: een bouwoplossing die past bij jouw locatie, planning en wensen. We begeleiden het hele project en doen de volledige coördinatie op de bouwplaats.\n\nBij Envicon draait modulair bouwen om een persoonlijke aanpak. Je hebt één vast aanspreekpunt die binnen één werkdag antwoord geeft op jouw vragen. Daarnaast denken we altijd een stap verder: misschien heb je naast noodlokalen ook een extra fietsenstalling of kantoorruimte nodig. Loopt de planning ineens anders? Dan spelen we daar flexibel op in, zodat jouw project gewoon doorgaat.\n\nNatuurlijk bouwen we duurzaam en toekomstbestendig. Onze modulaire gebouwen zijn demontabel, energiezuinig en kunnen ontworpen worden volgens de BENG-normen (Bijna Energieneutrale Gebouwen). We bieden standaard warmtepompen, A+++ airconditioning en LED-verlichting."
        }
      ],
      advantagesTitle: "De voordelen van modulair bouwen",
      advantages: [
        {
          icon: "speed",
          title: "Snel gebouwd, minimale overlast",
          description: "Omdat we de bouwonderdelen grotendeels in de werkplaats voorbereiden, kunnen we op locatie snel en efficiënt werken. Zo beperken we de bouwtijd én de overlast op de bouwplaats. Ook ben je zo minder afhankelijk van weersomstandigheden en externe factoren, wat de voortgang en planning ten goede komt."
        },
        {
          icon: "tune",
          title: "Flexibel in ontwerp",
          description: "We ontwerpen elke modulaire unit of demontabel bouwsysteem precies zoals jij het wilt, passend bij de locatie en het gebruik. Verandert de behoefte later? Dan kunnen we het gebouw eenvoudig aanpassen of hergebruiken voor een nieuw project."
        },
        {
          icon: "apartment",
          title: "Representatieve uitstraling",
          description: "De afwerking en gevelbekleding van de modulaire gebouwen stemmen we af op de omgeving, zowel in materiaal als kleur. Zo heb jij tijdelijke huisvesting met de uitstraling van permanent vastgoed."
        },
        {
          icon: "eco",
          title: "Minder CO₂-uitstoot en geluidsoverlast",
          description: "De bouwdelen van modulaire gebouwen kunnen wij vlak aanleveren, waardoor er meer gestapeld kan worden. Zo kunnen we meer tegelijk vervoeren, met minder transport, verkeersdrukte en hijswerk tot gevolg. Dat verkleint de overlast voor omwonenden en verlaagt de CO₂-uitstoot op de bouwplaats."
        },
        {
          icon: "recycling",
          title: "Circulair en toekomstbestendig",
          description: "Onze bouwsystemen zijn volledig demontabel. De onderdelen kunnen na gebruik makkelijk uit elkaar worden gehaald en worden ingezet bij een ander bouwproject. Dit heet ook wel circulair bouwen. Zo beperken we restafval en dragen we bij aan de circulaire ambities van gemeenten. Daarnaast kunnen onze modulaire gebouwen aan de BENG-eisen (Bijna Energieneutrale Gebouwen) voldoen."
        }
      ],
      processTitle: "Onze werkwijze",
      processDescription: "Bij Envicon weet je altijd waar je aan toe bent. We houden de lijnen kort, werken volgens een strakke planning en geven eerlijk advies.",
      processSteps: [
        {
          title: "1. Ontwerp",
          content: "Samen vertalen we jouw idee naar een ontwerp dat past binnen ons demontabel bouwsysteem. Het ontwerp stemmen we af op jouw locatie, planning en budget. Onze tekenaars maken het plan visueel, zodat je precies weet wat je kunt verwachten. We denken ook mee over de verdere inrichting van het terrein, zoals bestrating, groen en extra voorzieningen."
        },
        {
          title: "2. Werkvoorbereiding",
          content: "Als het ontwerp klaar is, regelen wij de rest. We maken een projectplan waarin alle mijlpalen, levertijden en verantwoordelijkheden duidelijk staan beschreven. We doen de inkoop van materialen en installaties, en stemmen alles af met onze vaste leveranciers en onderaannemers. Ook regelen we de juiste vergunningen. Zo verloopt de bouwfase soepel en zonder verrassingen."
        },
        {
          title: "3. Uitvoering",
          content: "We zijn aanwezig op de bouwplaats en dat merk je in snelheid en kwaliteit. We houden het overzicht, sturen het team aan en zorgen dat alle betrokken partijen goed zijn geïnformeerd. Dat betekent ook dat we goed contact houden met de omgeving, bijvoorbeeld door rondleidingen of updates te geven aan buurtbewoners. Loopt er iets anders dan gepland? Dan schakelen we direct."
        },
        {
          title: "4. Oplevering & nazorg",
          content: "Na de oplevering zorgen we dat alles tot in detail klopt. We lopen samen onze checklist door en blijven ook daarna betrokken. Het gebouw is direct klaar voor gebruik, en als er later iets aangepast moet worden, lossen we dat gewoon op."
        }
      ],
      safetyTitle: "Veiligheid binnen onze projecten",
      safetyContent: "Veiligheid staat bij Envicon voorop. We werken volgens de richtlijnen van VCA (Veiligheid, Gezondheid en Milieu Checklist Aannemers) en zijn bezig met het behalen van onze VCA** (twee sterren) certificering. Dit betekent dat veiligheid structureel onderdeel is van onze werkwijze.\n\nOnze medewerkers beschikken over een VCA-VOL certificaat, waardoor zij aantoonbaar zijn opgeleid in veilig werken, risicobeheersing en het herkennen van onveilige situaties. Ook onze onderaannemers werken volgens de VCA-eisen.\n\nOp onze projectlocaties gelden heldere veiligheidsprocedures en wordt actief toegezien op naleving van de geldende voorschriften. Voor de start van ieder project maken we een V&G-plan (Veiligheid & Gezondheid), waarin de risico's, verantwoordelijkheden en maatregelen worden vastgelegd. Tijdens de uitvoering houden we de veiligheid actief in de gaten met toolbox meetings, veiligheidsinspecties en werkplekcontroles. Zo blijven we alert en kunnen we snel schakelen wanneer dat nodig is.",
      faqTitle: "Veelgestelde vragen over modulair bouwen",
      faqItems: [
        {
          title: "Wat is het verschil tussen prefab en modulair bouwen?",
          content: "Prefab staat voor 'prefabricated', oftewel voorgefabriceerd. Bij prefab bouw worden onderdelen zoals gevels, wanden, vloeren of daken in de fabriek gemaakt. Op de bouwplaats worden deze onderdelen samengevoegd tot één gebouw.\n\nDe voordelen van prefab bouwen zijn:\n• Hogere kwaliteit door gecontroleerde productieomstandigheden\n• Kortere bouwtijd op locatie\n• Minder overlast en afval\n\nPrefab richt zich dus op onderdelen die vooraf in de fabriek worden gemaakt.\n\nModulair bouwen gaat nog een stap verder. Hierbij wordt niet alleen een onderdeel, maar een complete ruimte of module – bijvoorbeeld een flexwoning, kantoorunit of noodlokaal – in de fabriek geproduceerd. Elke module is zelfstandig en verplaatsbaar. Gebouwen kunnen daardoor eenvoudig worden uitgebreid, aangepast of hergebruikt.\n\nDe voordelen van modulair bouwen zijn:\n• Snel te monteren en te demonteren\n• Flexibele indeling en schaalbaarheid\n• Volledig herbruikbaar en dus een circulaire oplossing\n\nKortom, elke modulaire bouw is prefab, maar niet elke prefab bouw is modulair."
        },
        {
          title: "Is modulair bouwen goedkoper dan traditioneel bouwen?",
          content: "Wanneer je naar het hele bouwproces kijkt ben je met modulaire bouw vaak goedkoper uit dan met traditionele bouw. Doordat veel onderdelen al in de fabriek worden gemaakt, verloopt de bouw sneller en is er minder werk op locatie. Dat bespaart dus tijd en arbeid. Bovendien zijn modulaire gebouwen herbruikbaar en eenvoudig aan te passen. Daardoor levert modulair bouwen niet alleen financiële voordelen op, maar ook een duurzamere oplossing voor de toekomst."
        },
        {
          title: "Zijn modulaire gebouwen de moeite waard?",
          content: "Ja, modulaire gebouwen zijn zeker de moeite waard. Omdat de modules grotendeels in de fabriek worden gebouwd, verloopt het bouwproces snel en heb je op de bouwlocatie nauwelijks overlast. Tegelijkertijd bieden modulaire gebouwen de kwaliteit en uitstraling van permanente huisvesting.\n\nDaarnaast zijn ze volledig demontabel. Dat betekent dat je ze later eenvoudig kunt aanpassen, uitbreiden of verplaatsen. Zo investeer je in een flexibele en duurzame oplossing die meebeweegt met jouw behoeften."
        }
      ],
      ctaTitle: "Wil je advies over modulair bouwen?",
      ctaButtonText: "Neem contact op",
      ctaButtonUrl: "/contact",
      metaTitle: "Wat is modulair bouwen? | Envicon",
      metaDescription: "Modulair bouwen is een slimme, duurzame bouwmethode waarbij gebouwen bestaan uit losse onderdelen."
    },
    {
      slug: "tijdelijke-huisvesting",
      title: "Tijdelijke huisvesting",
      category: "DIENST",
      description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.",
      order: 2,
      heroTitle: "Wat is tijdelijke huisvesting?",
      heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.\n\nOnze tijdelijke gebouwen worden opgebouwd uit demontabele bouwdelen, waardoor ze flexibel zijn in ontwerp en eenvoudig kunnen worden verplaatst of hergebruikt. Daarmee sluiten we perfect aan bij de behoeften van gemeenten, onderwijsinstellingen, sportverenigingen en bedrijven die zoeken naar tijdelijke huisvesting.",
      heroButton1Text: "Neem contact op",
      heroButton1Url: "/contact",
      contentBlocks: [
        {
          title: "Persoonlijk advies over tijdelijke huisvesting",
          content: "Ineens extra woonruimte of noodlokalen nodig? De vraag naar tijdelijke huisvesting is vaak urgent. Daarom begeleiden we het hele project en doen we de volledige coördinatie op de bouwplaats. Zo ben jij geen tijd kwijt aan het zoeken van geschikte partners en leveranciers. Dankzij onze flexibele bouwsystemen leveren we altijd maatwerk: een bouwoplossing die past bij jouw locatie, planning en wensen.\n\nBij Envicon hebben we een persoonlijke aanpak. Je hebt altijd één vast aanspreekpunt dat binnen één werkdag reageert. Daarnaast denken we altijd een stap verder: misschien heb je naast flexwoningen ook een extra fietsenstalling of kantoorruimte nodig.\n\nNatuurlijk bouwen we duurzaam en toekomstbestendig. Onze modulaire gebouwen zijn volledig demontabel. Heb je de tijdelijke gebouwen niet meer nodig? Dan kunnen ze na gebruik makkelijk worden gedemonteerd. De modulaire units zijn energiezuinig en kunnen ontworpen worden volgens de BENG-normen (Bijna Energieneutrale Gebouwen). We werken standaard met warmtepompen, A+++ airconditioning en LED-verlichting."
        }
      ],
      advantagesTitle: "De voordelen van tijdelijke huisvesting",
      advantages: [
        {
          icon: "speed",
          title: "Snel inzetbaar bij urgente huisvestingsvragen",
          description: "Heb je op korte termijn extra ruimte nodig? Dan kun je op Envicon rekenen. We bereiden de bouwonderdelen grotendeels voor in onze eigen werkplaats. Daardoor is de montage op locatie een kwestie van weken in plaats van maanden, met minimale overlast voor de omgeving. Na plaatsing is het gebouw direct gebruiksklaar, compleet met apparatuur en afwerking."
        },
        {
          icon: "refresh",
          title: "Verplaatsbaar en herbruikbaar",
          description: "Onze gebouwen zijn volledig demontabel. Wanneer jij de tijdelijke huisvesting niet meer nodig hebt, verplaatsen we het gebouw snel en eenvoudig naar een andere plek of passen we het aan voor een nieuw bouwproject."
        },
        {
          icon: "tune",
          title: "Flexibel in ontwerp",
          description: "Waar standaard prefab units vaste afmetingen hebben, passen wij elk gebouw volledig aan op jouw wensen en locatie. Ook tijdelijke huisvesting krijgt bij ons de uitstraling en functionaliteit van een permanente oplossing. Of het nu gaat om een opvanglocatie voor vluchtelingen, een dependance van een school een compleet kantoorpand, wij verzorgen alles van vergunning tot oplevering."
        },
        {
          icon: "eco",
          title: "Duurzaam en energiezuinig",
          description: "De bouwdelen van onze demontabele bouwsystemen kunnen we vlak aanleveren, waardoor er meer kan worden gestapeld. Dat betekent minder transport, minder hijswerk en minder verkeersdrukte op locatie. Dat verkleint de overlast voor omwonenden en verlaagt de CO₂-uitstoot op de bouwplaats. Daarnaast kunnen onze modulaire gebouwen aan de BENG-eisen (Bijna Energieneutrale Gebouwen) voldoen."
        },
        {
          icon: "apartment",
          title: "Representatieve uitstraling",
          description: "De afwerking en gevelbekleding van de modulaire gebouwen stemmen we af op de omgeving, zowel in materiaal als kleur. Zo heb jij tijdelijke huisvesting met de uitstraling van permanent vastgoed."
        }
      ],
      processTitle: "Onze werkwijze",
      processDescription: "Bij Envicon weet je altijd waar je aan toe bent. We houden de lijnen kort, werken volgens een strakke planning en geven eerlijk advies.",
      processSteps: [
        {
          title: "1. Ontwerp",
          content: "Samen vertalen we jouw idee naar een ontwerp dat past binnen ons demontabele bouwsysteem. Het ontwerp stemmen we af op jouw locatie, planning en budget. Onze tekenaars maken het plan visueel, zodat je precies weet wat je kunt verwachten. We denken ook mee over de verdere inrichting van het terrein, zoals bestrating, groen en extra voorzieningen."
        },
        {
          title: "2. Werkvoorbereiding",
          content: "Als het ontwerp klaar is, regelen wij de rest. We maken een projectplan waarin alle mijlpalen, levertijden en verantwoordelijkheden duidelijk staan beschreven. We doen de inkoop van materialen en installaties, en stemmen alles af met onze vaste leveranciers en onderaannemers. Ook regelen we de juiste vergunningen. Zo verloopt de bouwfase soepel en zonder verrassingen."
        },
        {
          title: "3. Uitvoering",
          content: "We zijn aanwezig op de bouwplaats en dat merk je in snelheid en kwaliteit. We houden het overzicht, sturen het team aan en zorgen dat alle betrokken partijen goed zijn geïnformeerd. Dat betekent ook dat we goed contact houden met de omgeving, bijvoorbeeld door rondleidingen of updates te geven aan buurtbewoners. Loopt er iets anders dan gepland? Dan schakelen we direct."
        },
        {
          title: "4. Oplevering & nazorg",
          content: "Na de oplevering zorgen we dat alles tot in detail klopt. We lopen samen een lijst door en blijven ook daarna betrokken. De tijdelijke huisvesting is direct klaar voor gebruik, en als er later iets aangepast moet worden, lossen we dat gewoon op."
        }
      ],
      safetyTitle: "Veiligheid binnen onze projecten",
      safetyContent: "Veiligheid staat bij Envicon voorop. We werken volgens de richtlijnen van VCA (Veiligheid, Gezondheid en Milieu Checklist Aannemers) en zijn bezig met het behalen van onze VCA** (twee sterren) certificering. Dit betekent dat veiligheid structureel onderdeel is van onze werkwijze.\n\nOnze medewerkers beschikken over een VCA-VOL certificaat, waardoor zij aantoonbaar zijn opgeleid in veilig werken, risicobeheersing en het herkennen van onveilige situaties. Ook onze onderaannemers werken volgens de VCA-eisen.\n\nOp onze projectlocaties gelden heldere veiligheidsprocedures en wordt actief toegezien op naleving van de geldende voorschriften. Voor de start van ieder project maken we een V&G-plan (Veiligheid & Gezondheid), waarin de risico's, verantwoordelijkheden en maatregelen worden vastgelegd. Tijdens de uitvoering houden we de veiligheid actief in de gaten met toolbox meetings, veiligheidsinspecties en werkplekcontroles. Zo blijven we alert en kunnen we snel schakelen wanneer dat nodig is.",
      faqTitle: "Veelgestelde vragen over tijdelijke huisvesting",
      faqItems: [
        {
          title: "Is een vergunning nodig voor tijdelijke huisvesting?",
          content: "In de meeste gevallen heb je voor tijdelijke huisvesting een omgevingsvergunning nodig. Wij regelen dit graag voor je. Envicon verzorgt de aanvraag van begin tot eind en zorgt dat alle documenten juist worden aangeleverd. Zo verloopt het proces efficiënt en kan de bouw snel starten."
        },
        {
          title: "Is tijdelijke huisvesting duurzaam?",
          content: "Ja, onze tijdelijke gebouwen zijn volledig demontabel en herbruikbaar. De bouwonderdelen kunnen na gebruik eenvoudig worden verplaatst of opnieuw ingezet voor een ander project. Zo beperken we afval en CO₂-uitstoot. Bovendien kunnen onze gebouwen aan de BENG-eisen voldoen en zijn ze standaard uitgerust met energiezuinige installaties."
        },
        {
          title: "Wat kost een tijdelijke woonunit?",
          content: "De prijs van een tijdelijke woonunit hangt af van de grootte, indeling en afwerking die je kiest. Elk modulair gebouw maken wij op maat, zodat het precies past bij jouw wensen en locatie. Na een adviesgesprek ontvang je van ons een heldere offerte. Benieuwd naar de mogelijkheden voor jouw bouwproject? Neem contact op via hallo@envicon.nl of +31 (0)85 273 67 54."
        }
      ],
      ctaTitle: "Wil je advies over tijdelijke huisvesting?",
      ctaButtonText: "Neem contact op",
      ctaButtonUrl: "/contact",
      metaTitle: "Wat is tijdelijke huisvesting? | Envicon",
      metaDescription: "Tijdelijke huisvesting biedt snel gebouwen voor wonen, werken, sport en onderwijs. Envicon regelt het."
    }
  ],

  // Continued in next message due to length...
};

async function importAllContent() {
  console.log('🚀 Starting RTF content import to Strapi...\n');

  try {
    // 1. Update Homepage
    console.log('\n📄 Updating Homepage...');
    await updateSingleType('homepage', {
      hero: content.homepage.hero,
      about: content.homepage.about,
    });

    // 2. Import Services (Modulair bouwen, Tijdelijke huisvesting)
    console.log('\n📦 Importing Services (Diensten)...');
    for (const service of content.services) {
      await findOrCreateEntry('services', service, 'slug');
    }

    console.log('\n✅ Import completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Rebuild Strapi: cd strapi-cms && npm run build');
    console.log('2. Restart Strapi: pm2 restart strapi-cms');
    console.log('3. Check the admin panel to verify content');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importAllContent();

