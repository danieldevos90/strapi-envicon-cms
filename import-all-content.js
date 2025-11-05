/**
 * Complete Content Import Script for Envicon Website
 * Imports ALL content from text_for_pages.rtf into Strapi CMS
 * 
 * Run with: npm run import-content
 * Or: STRAPI_API_TOKEN=your_token npm run import-content
 */

const axios = require('axios');

// Configuration
const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.API_TOKEN;

if (!API_TOKEN) {
  console.error('\n❌ Error: API Token is required');
  console.log('\n📝 How to get your API token:');
  console.log('1. Open Strapi admin panel');
  console.log('2. Go to Settings → API Tokens');
  console.log('3. Click "Create new API Token"');
  console.log('4. Name: "Content Import", Type: "Full access", Duration: "Unlimited"');
  console.log('5. Copy the token and run:');
  console.log('   STRAPI_API_TOKEN=your_token npm run import-content\n');
  process.exit(1);
}

const apiClient = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

console.log(`\n🌐 Connecting to Strapi at: ${STRAPI_URL}\n`);

// Utility functions
async function findOrCreateEntry(contentType, data, identifier = 'title') {
  try {
    const encodedValue = encodeURIComponent(data[identifier]);
    const response = await apiClient.get(`/api/${contentType}?filters[${identifier}][$eq]=${encodedValue}`);
    
    if (response.data.data && response.data.data.length > 0) {
      const id = response.data.data[0].id;
      console.log(`  📝 Updating: ${data[identifier]}`);
      await apiClient.put(`/api/${contentType}/${id}`, { data });
      return response.data.data[0];
    } else {
      console.log(`  ✨ Creating: ${data[identifier]}`);
      const createResponse = await apiClient.post(`/api/${contentType}`, { data });
      return createResponse.data.data;
    }
  } catch (error) {
    console.error(`  ❌ Error with ${contentType}:`, error.response?.data?.error || error.message);
    return null;
  }
}

async function updateSingleType(contentType, data) {
  try {
    console.log(`  📝 Updating ${contentType}...`);
    await apiClient.put(`/api/${contentType}`, { data });
    console.log(`  ✅ Updated ${contentType}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error updating ${contentType}:`, error.response?.data?.error || error.message);
    return false;
  }
}

// ========================================
// CONTENT DATA FROM RTF FILE
// ========================================

const homepageContent = {
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
};

const servicesContent = [
  {
    slug: "modulair-bouwen",
    title: "Modulair bouwen",
    category: "DIENST",
    description: "Onze modulaire gebouwen zijn voor tijdelijk gebruik, maar bieden permanente kwaliteit. Snel beschikbaar, duurzaam gebouwd en fijn in gebruik.",
    order: 0,
    heroTitle: "Wat is modulair bouwen?",
    heroDescription: "Modulair bouwen betekent dat een gebouw wordt opgebouwd uit complete, vooraf geproduceerde modules. De bouwonderdelen worden grotendeels in de fabriek gemaakt en op locatie gemonteerd. Zo ben je verzekerd van een snelle bouwtijd én minimale overlast op de bouwplaats.\n\nModulair bouwen is een vorm van demontabel bouwen. De modules kunnen eenvoudig worden gedemonteerd, verplaatst en hergebruikt. Het is een flexibele en duurzame bouwoplossing die meebeweegt met jouw behoeften.",
    heroButton1Text: "Neem contact op",
    heroButton1Url: "/contact",
    heroButton2Text: "Meer info",
    heroButton2Url: "/adviesgesprek",
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
    description: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.",
    order: 1,
    heroTitle: "Wat is tijdelijke huisvesting?",
    heroDescription: "Tijdelijke huisvesting biedt een snelle en flexibele oplossing bij een tijdelijk tekort aan ruimte. Denk bijvoorbeeld aan extra klaslokalen voor leerlingen of flexwoningen voor studenten. Wij ontwikkelen modulaire gebouwen die in korte tijd geplaatst kunnen worden, zonder in te leveren op comfort en kwaliteit.\n\nOnze tijdelijke gebouwen worden opgebouwd uit demontabele bouwdelen, waardoor ze flexibel zijn in ontwerp en eenvoudig kunnen worden verplaatst of hergebruikt. Daarmee sluiten we perfect aan bij de behoeften van gemeenten, onderwijsinstellingen, sportverenigingen en bedrijven die zoeken naar tijdelijke huisvesting.",
    heroButton1Text: "Neem contact op",
    heroButton1Url: "/contact",
    heroButton2Text: "Meer info",
    heroButton2Url: "/adviesgesprek",
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
  },
  {
    slug: "projectmanagement",
    title: "Projectmanagement",
    category: "DIENST",
    description: "Vanaf de eerste schets tot de oplevering houden we het overzicht. We plannen, coördineren en bewaken de voortgang, zodat alles volgens afspraak verloopt. Jij hebt één aanspreekpunt en altijd inzicht in wat er speelt.",
    order: 2
  },
  {
    slug: "vergunningen-regelgeving",
    title: "Vergunningen & regelgeving",
    category: "DIENST",
    description: "Vergunningen, regels, normen... wij snappen dat het veel is. Daarom nemen we dit helemaal uit handen. Wij zorgen dat jouw bouwproject verloopt volgens de geldende wet- en regelgeving.",
    order: 3
  },
  {
    slug: "funderingen-grondwerk",
    title: "Funderingen & grondwerk",
    category: "DIENST",
    description: "Van bodemonderzoek tot fundering, wij regelen het complete grondwerk. Wij zorgen dat alles goed is voorbereid, zodat je niet voor verrassingen komt te staan.",
    order: 4
  },
  {
    slug: "ew-installaties",
    title: "E+W-installaties",
    category: "DIENST",
    description: "Verlichting, verwarming, waterinstallaties, wij regelen het allemaal. Onze installaties zijn energiezuinig, veilig en toekomstbestendig.",
    order: 5
  },
  {
    slug: "afbouw-turnkey-oplevering",
    title: "Afbouw & turnkey oplevering",
    category: "DIENST",
    description: "We leveren het gebouw gebruiksklaar op, afgewerkt tot in de details. Geen losse eindjes, maar een compleet gebouw waar je meteen in kunt.",
    order: 6
  },
  {
    slug: "terreininrichting",
    title: "Terreininrichting",
    category: "DIENST",
    description: "We denken verder dan alleen het gebouw. Van bestrating tot groen en verlichting. We zorgen dat het terrein er netjes bij ligt en direct gebruikt kan worden.",
    order: 7
  },
  {
    slug: "buurtmanagement",
    title: "Buurtmanagement",
    category: "DIENST",
    description: "Bouwen heeft ook impact op de omgeving. We houden omwonenden goed op de hoogte, beantwoorden vragen en lossen knelpunten snel op. Zo blijft de omgeving betrokken en verloopt de bouw soepel.",
    order: 8
  }
];

const sectorsContent = [
  {
    slug: "onderwijs",
    title: "Onderwijs",
    category: "SECTOR",
    description: "Tijdelijke onderwijshuisvesting voor kindcentra, basisscholen, middelbare scholen en universiteiten.",
    order: 0,
    contentTitle: "Tijdelijke onderwijshuisvesting",
    contentSubtitle: "Een groeiend aantal leerlingen, een verbouwing of tijdelijke verhuizing. Soms heeft jouw school gewoon snel extra ruimte nodig. We bouwen tijdelijke klaslokalen, kantines, gymzalen en complete schoolgebouwen voor kindcentra, basisscholen, middelbare scholen en universiteiten. Onze modulaire units en demontabele bouwsystemen zijn veilig en voelen aan als een permanent schoolgebouw: een plek waar leerlingen prettig kunnen leren.",
    textBlocks: [
      {
        title: "Snel een oplossing voor jouw schoolgebouw",
        content: "Als school wil je dat de lessen gewoon door kunnen blijven gaan. Daarom bouwen we snel en met zo min mogelijk overlast. Onze modulaire units en demontabele bouwsystemen zijn eenvoudig aan te passen als het aantal leerlingen verandert. We leveren ze gebruiksklaar op met verlichting, sanitair en garderobes.\n\nDe tijdelijke gebouwen kunnen wij realiseren volgens het Programma van Eisen Frisse Scholen (klasse B of C). Daarmee creëren we een gezonde, veilige en energiezuinige leeromgeving met:\n\n• Gebalanceerde ventilatie met CO₂-sturing\n• Veel daglicht en goed akoestisch comfort\n• Energiezuinige installaties\n• Een aangenaam binnenklimaat"
      }
    ],
    featuresTitle: "De voordelen van onderwijshuisvesting door Envicon",
    features: [
      {
        icon: "school",
        title: "Flexibel inzetbaar",
        description: "Onze modulaire gebouwen zijn flexibel inzetbaar: als uitbreiding van een permanent schoolgebouw of dependance."
      },
      {
        icon: "thermostat",
        title: "Comfortabel klimaat",
        description: "Dankzij slimme klimaatbeheersing is de ruimte comfortabel in elk seizoen."
      },
      {
        icon: "volume_mute",
        title: "Goede akoestiek",
        description: "Goede akoestiek zorgt voor rust in de klas en een fijne leeromgeving."
      },
      {
        icon: "add_circle",
        title: "Extra voorzieningen",
        description: "We denken verder dan het gebouw, zoals een extra fietsenhok of speeltuin."
      }
    ],
    solutionsTitle: "Onze modulaire oplossingen voor het onderwijs",
    solutionsDescription: "We bieden diverse oplossingen voor tijdelijke onderwijshuisvesting. Van een paar extra noodlokalen tot uitbreiding van een campus, met onze jarenlange ervaring weten we precies wat er nodig is om snel en soepel te bouwen.",
    metaTitle: "Tijdelijke onderwijshuisvesting door Envicon",
    metaDescription: "Tijdelijke onderwijshuisvesting nodig? Wij hebben een ruim aanbod modulaire schoolgebouwen."
  },
  {
    slug: "wonen",
    title: "Wonen",
    category: "SECTOR",
    description: "Tijdelijke woningen voor arbeidsmigranten, studenten en vluchtelingen.",
    order: 1,
    contentTitle: "Tijdelijke woningen laten bouwen",
    contentSubtitle: "Tijdelijke huisvesting voor arbeidsmigranten, opvang voor vluchtelingen of woonruimte voor startende studenten. Je wilt vooral een snelle en praktische oplossing. Met onze modulaire units en demontabele bouwsystemen is dat mogelijk.\n\nWe realiseren tijdelijke woonunits en complete wooncomplexen die veilig en energiezuinig zijn. Onze modulaire gebouwen voelen aan als een echte woning, een plek waar mensen zich thuis voelen, ook al is het tijdelijk.",
    textBlocks: [
      {
        title: "Snel een oplossing voor jouw huisvestingsvraag",
        content: "Als gemeente, woningcorporatie of bedrijf wil je dat mensen snel een fijne woonplek krijgen. Envicon realiseert modulaire woningen die in korte tijd op locatie worden opgebouwd. Ze bieden hetzelfde comfort als permanente huisvesting en kunnen later eenvoudig worden gedemonteerd. Deze materialen worden hergebruikt.\n\nWe bouwen met zo min mogelijk overlast en leveren de woningen gebruiksklaar op, compleet met keuken, sanitair en alle aansluitingen."
      }
    ],
    featuresTitle: "De voordelen van tijdelijke huisvesting door Envicon",
    features: [
      {
        icon: "eco",
        title: "Duurzame keuze",
        description: "Een duurzame keuze: onze woningen zijn herbruikbaar en energiezuinig."
      },
      {
        icon: "task_alt",
        title: "Alles geregeld",
        description: "We regelen alles: van vergunning tot oplevering."
      },
      {
        icon: "thermostat",
        title: "Slim klimaat",
        description: "Dankzij slimme klimaatbeheersing is de woning comfortabel in elk seizoen."
      },
      {
        icon: "landscapescape",
        title: "Terreininrichting",
        description: "We denken met je mee over de verdere inrichting van het terrein, zoals parkeerplaatsen en groenvoorziening."
      }
    ],
    solutionsTitle: "Onze modulaire oplossingen voor tijdelijke huisvesting",
    solutionsDescription: "Of het nu gaat om tijdelijke huisvesting voor arbeidsmigranten, personeel dat dicht bij de werklocatie moet wonen of containerwoningen voor studenten, wij regelen dat er snel goede woonruimte is.",
    metaTitle: "Tijdelijke woningen bouwen | Snel opgeleverd",
    metaDescription: "Tijdelijke woningen nodig voor personeel, studenten of vluchtelingen? Wij bouwen flexwoningen op maat."
  },
  {
    slug: "bouw-industrie",
    title: "Bouw & Industrie",
    category: "SECTOR",
    description: "Tijdelijke huisvesting voor bouw- en industrieprojecten.",
    order: 2,
    contentTitle: "Tijdelijke huisvesting voor bouw en industrie",
    contentSubtitle: "In de bouw en industrie is geen dag hetzelfde. Projecten worden uitgebreid, er is plotseling een bouwstop of een nieuw team komt op locatie. Dan wil je snel kunnen schakelen.\n\nEnvicon biedt modulaire units en demontabele bouwsystemen die in korte tijd op locatie worden opgebouwd. We bouwen tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen. Ook voor tijdelijke personeelshuisvesting en tijdelijke kantooruitbreiding bieden we praktische oplossingen.",
    textBlocks: [
      {
        title: "Modulaire units voor tijdelijke huisvesting",
        content: "Onze modulaire units en demontabele bouwsystemen voldoen aan alle veiligheidseisen en worden gebruiksklaar opgeleverd, zodat jouw team direct aan de slag kan. We nemen alles uit handen: van vergunningen tot oplevering. Zo weet je zeker dat alles goed geregeld is."
      }
    ],
    featuresTitle: "De voordelen van tijdelijke huisvesting door Envicon",
    features: [
      {
        icon: "speed",
        title: "Snel gebruiksklaar",
        description: "Snel opgebouwd en direct gebruiksklaar."
      },
      {
        icon: "tune",
        title: "Flexibel",
        description: "Flexibel aan te passen of te verplaatsen naar een nieuwe bouwlocatie."
      },
      {
        icon: "recycling",
        title: "Duurzaam",
        description: "Duurzame keuze dankzij herbruikbare bouwsystemen."
      },
      {
        icon: "task_alt",
        title: "Alles geregeld",
        description: "Alles van A tot Z geregeld."
      }
    ],
    solutionsTitle: "Onze modulaire oplossingen voor bouw en industrie",
    solutionsDescription: "Bij ons vind je huisvestingsoplossingen voor allerlei toepassingen binnen de bouw en industrie. Onze modulaire units zijn makkelijk te demonteren en te verplaatsen, zodat je snel kunt inspelen op veranderingen op jouw bouw- of industrieterrein.",
    metaTitle: "Tijdelijke huisvesting voor bouw en industrie",
    metaDescription: "Envicon bouwt tijdelijke kantoorruimtes, kleedruimtes, schaftketen, sanitaire voorzieningen en opslagloodsen."
  },
  {
    slug: "sport",
    title: "Sport",
    category: "SECTOR",
    description: "Tijdelijke sportvoorzieningen en sporthallen.",
    order: 3,
    contentTitle: "Tijdelijke sporthal laten bouwen",
    contentSubtitle: "Een sportvoorziening moet altijd beschikbaar zijn. Of het nu gaat om renovatie, een tijdelijke sluiting door een calamiteit, of extra ruimte door een groeiend ledenaantal, Envicon zorgt dat mensen kunnen blijven sporten. Zelfs een overkapping van een buitenbaan regelen we zo.\n\nMet onze modulaire units en demontabele bouwsystemen bouwen we tijdelijke sportvoorzieningen die net zo comfortabel zijn als vaste gebouwen. We richten de tijdelijke sporthal volledig in met kleedruimtes, douches, behandelruimtes, tribune, kantine en kantoorvoorzieningen. Volledig afgestemd op jouw wensen en gebruik.",
    textBlocks: [
      {
        title: "Modulaire sporthal als tijdelijke oplossing",
        content: "Envicon bouwt tijdelijke sportvoorzieningen door heel Nederland. We begeleiden het project van A tot Z. Daarbij denken we mee over een praktische indeling en zorgen we dat elke ruimte voldoet aan alle veiligheidseisen. We letten op een goede akoestiek, leggen veilige sportvloeren en kunnen de hal volledig voorzien van sporttoestellen.\n\nOnze demontabele sporthallen zijn flexibel aan te passen én weer snel te demonteren. Dankzij goede isolatie en klimaatbeheersing zijn ze energiezuinig én fijn om in te sporten."
      }
    ],
    featuresTitle: "De voordelen van een tijdelijke sporthal door Envicon",
    features: [
      {
        icon: "handshake",
        title: "Persoonlijk advies",
        description: "Eén vaste partner die met je meedenkt en eerlijk advies geeft."
      },
      {
        icon: "apartment",
        title: "Representatief",
        description: "De representatieve uitstraling van een permanente sporthal."
      },
      {
        icon: "schedule",
        title: "Flexibele duur",
        description: "Te gebruiken van enkele maanden tot meerdere jaren."
      },
      {
        icon: "volume_mute",
        title: "Comfortabel",
        description: "Comfortabel sporten dankzij goede isolatie en optimale akoestiek."
      }
    ],
    solutionsTitle: "Onze modulaire oplossingen voor tijdelijke sportvoorzieningen",
    solutionsDescription: "Met onze modulaire gebouwen ontwikkelen we in korte tijd een flexibele oplossing voor jouw sportlocatie. Van een extra kleedruimte naast het voetbalveld tot een compleet sportcomplex met verschillende faciliteiten.",
    metaTitle: "Tijdelijke sporthal bouwen | Snel opgeleverd",
    metaDescription: "Tijdelijke sporthal nodig? Envicon levert snel modulaire sporthallen door heel Nederland."
  }
];

const aboutPageContent = {
  heroTitle: "Tijdelijke bouw, permanente kwaliteit",
  heroDescription: "Envicon bouwt sneller en slimmer, zonder in te leveren op kwaliteit. Onze tijdelijke gebouwen zijn net zo comfortabel en gebruiksvriendelijk als permanente huisvesting. We leveren modulaire gebouwen waarin mensen graag werken, leren of sporten én die er ook nog eens goed uitzien.\n\nBij ons ben je in goede handen: van de eerste schets tot en met de oplevering. En we houden van duidelijkheid. Eén team, korte lijnen en heldere afspraken. Dankzij onze gestroomlijnde werkwijze en flexibel bouwsystemen schakelen we snel.\n\nAls modulair bouwer in Nederland helpen we gemeenten, scholen, sportverenigingen en bedrijven met tijdelijke bouwoplossingen. We stemmen het bouwproject helemaal af op jouw wensen en de locatie.",
  teamTitle: "Het team",
  teamContent: "Envicon is opgericht door Kyle Lambert en Steven Hageman, twee professionals met een hart voor de bouw. Ze zagen dat er tijdens bouwprojecten regelmatig een afstand ontstond tussen opdrachtgever en bouwer, en besloten het anders te doen: persoonlijker, sneller en transparanter.\n\nKyle heeft een achtergrond in projectmanagement en ondernemerschap binnen de installatietechniek. Hij brengt structuur in complexe projecten en houdt altijd oog voor de mensen die erbij betrokken zijn. Steven werkt al meer dan tien jaar in de modulaire bouw. Hij kent de praktijk door en door en weet hoe je op de bouwplaats kunt blijven innoveren. Door kennis en inzichten uit eerdere projecten actief te delen, bieden zij jou een succesvolle modulaire bouwoplossing. Dat doen ze samen met een vast netwerk van partners door heel Nederland.",
  companyTitle: "Modulair bouwer in Nederland",
  companyContent: "Als modulair bouwer werken we door heel Nederland. We ontwikkelen diverse tijdelijke bouwoplossingen: van tijdelijke klaslokalen en flexwoningen tot kantoorruimtes en personeelshuisvesting in de bouw en industrie.\n\nDankzij ons landelijke netwerk kunnen we snel starten en flexibel opschalen, waar jouw bouwproject ook is. De modules voor onze gebouwen worden geproduceerd door onze vaste partners in Nederland. Deze gespecialiseerde producenten voldoen aan de hoogste kwaliteits- en duurzaamheidsnormen.",
  certificationsTitle: "Certificeringen & lidmaatschappen",
  certificationsContent: "Op de website plaatsen als de certificaten binnen zijn.",
  ctaTitle: "Op zoek naar een modulair bouwer in Nederland?",
  ctaButtonText: "Neem contact op",
  ctaButtonUrl: "/contact",
  metaTitle: "Over ons – Envicon – Modulair bouwer",
  metaDescription: "Als modulair bouwer in Nederland ontwikkelen wij tijdelijke huisvestingsoplossingen."
};

const contactPageContent = {
  heroTitle: "Neem contact op",
  heroDescription: "Heb je vragen over tijdelijke huisvesting of een ander modulair bouwproject? Vul het formulier in, dan nemen we binnen 24 uur contact met je op om jouw aanvraag te bespreken. Vervolgens ontvang je een persoonlijke offerte.",
  benefits: [
    {
      icon: "task_alt",
      title: "Persoonlijke en vrijblijvende offerte binnen één werkdag",
      description: ""
    },
    {
      icon: "support_agent",
      title: "Eerlijk en persoonlijk advies",
      description: ""
    },
    {
      icon: "payments",
      title: "Transparante prijzen",
      description: ""
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
  formDescription: "Hier is ruimte voor het contactformulier. Naast de persoonlijke gegevens kun je hier de persoon laten selecteren op sector, soort tijdelijke huisvesting, planning en bouwlocatie.",
  metaTitle: "Neem contact op | Envicon",
  metaDescription: "Heb je plannen voor tijdelijke bouw? Bel 085 273 67 54 of mail naar hallo@envicon.nl"
};

// ========================================
// IMPORT FUNCTIONS
// ========================================

async function importAllContent() {
  console.log('🚀 Starting complete content import...\n');
  
  let successCount = 0;
  let errorCount = 0;

  try {
    // Test connection first
    console.log('🔌 Testing connection to Strapi...');
    await apiClient.get('/api/');
    console.log('✅ Connected successfully!\n');
  } catch (error) {
    console.error('❌ Cannot connect to Strapi:', error.message);
    console.log('\n💡 Make sure Strapi is running:');
    console.log('   cd strapi-cms && npm run develop');
    process.exit(1);
  }

  // 1. Update Homepage
  console.log('📄 1/4 Updating Homepage...');
  const homepageSuccess = await updateSingleType('homepage', homepageContent);
  if (homepageSuccess) successCount++; else errorCount++;

  // 2. Import Services
  console.log('\n📦 2/4 Importing Services (Diensten)...');
  for (const service of servicesContent) {
    const result = await findOrCreateEntry('services', service, 'slug');
    if (result) successCount++; else errorCount++;
  }

  // 3. Import/Update Sectors
  console.log('\n🏢 3/4 Importing Sectors...');
  for (const sector of sectorsContent) {
    const result = await findOrCreateEntry('sectors', sector, 'slug');
    if (result) successCount++; else errorCount++;
  }

  // 4. Update About Page
  console.log('\n👥 4/4 Updating About Page...');
  const aboutSuccess = await updateSingleType('about-page', aboutPageContent);
  if (aboutSuccess) successCount++; else errorCount++;

  // 5. Update Contact Page
  console.log('\n📞 5/5 Updating Contact Page...');
  const contactSuccess = await updateSingleType('contact-page', contactPageContent);
  if (contactSuccess) successCount++; else errorCount++;

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary');
  console.log('='.repeat(50));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log('='.repeat(50));

  if (errorCount === 0) {
    console.log('\n🎉 All content imported successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Check content in Strapi admin panel');
    console.log('2. Add images/media to entries');
    console.log('3. Publish all entries (if in draft mode)');
    console.log('4. Test pages on your website\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Import completed with some errors.');
    console.log('Check the error messages above for details.\n');
    process.exit(1);
  }
}

// Run the import
importAllContent().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

