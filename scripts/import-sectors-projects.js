/**
 * Import Sample Sectors and Projects to Strapi
 * 
 * This script populates Strapi with sample sector and project data
 * 
 * Usage:
 * cd strapi-cms
 * node scripts/import-sectors-projects.js
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Sample Sectors Data
const sectors = [
  {
    title: 'Industrie',
    slug: 'industrie',
    category: 'SECTOR',
    description: 'Duurzame en flexibele bouwoplossingen voor de industriële sector.',
    order: 1,
    contentLabel: 'OVER INDUSTRIE',
    contentTitle: 'Industriële Bouwoplossingen',
    contentSubtitle: 'Wij bieden professionele bouwoplossingen speciaal voor de industriële sector. Van grote productiehallen tot compacte opslag units, wij hebben de expertise om uw project te realiseren.',
    textBlocks: [
      {
        title: 'Onze Aanpak',
        content: 'Met jarenlange ervaring in de industriële bouw begrijpen wij de unieke eisen en uitdagingen van deze sector. Wij werken nauw samen met u om oplossingen te creëren die perfect aansluiten bij uw bedrijfsprocessen.'
      },
      {
        title: 'Maatwerk Oplossingen',
        content: 'Elk industrieel project is uniek. Daarom bieden wij maatwerk oplossingen die precies passen bij uw specifieke behoeften en eisen. Van kleine werkplaatsen tot grote productiefaciliteiten.'
      }
    ],
    featuresLabel: 'DIENSTEN',
    featuresTitle: 'Onze Oplossingen voor Industrie',
    featuresSubtitle: 'Professionele en duurzame bouwoplossingen specifiek voor de industriële sector',
    features: [
      {
        title: 'Productiehallen',
        description: 'Grote, flexibele ruimtes voor productie en assemblage.',
        icon: 'concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Opslagunits',
        description: 'Veilige en efficiënte opslagoplossingen voor uw materialen.',
        icon: 'speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Werkplaatsen',
        description: 'Functionele werkruimtes voor onderhoud en reparaties.',
        icon: 'eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Kantoorruimtes',
        description: 'Modern ingerichte kantoren voor administratie en beheer.',
        icon: 'concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      }
    ],
    solutionsTitle: 'Onze modulaire oplossingen voor de industrie',
    solutionsDescription: 'Met onze modulaire gebouwen ontwikkelen we in korte tijd een flexibele oplossing voor jouw industriële locatie. Van productiehallen tot kantoorruimtes met verschillende faciliteiten.',
    solutionsBlockNumber: 4
  },
  {
    title: 'Evenementen',
    slug: 'evenementen',
    category: 'SECTOR',
    description: 'Tijdelijke en permanente structuren voor evenementen van elke omvang.',
    order: 2,
    contentLabel: 'OVER EVENEMENTEN',
    contentTitle: 'Evenementenbouw',
    contentSubtitle: 'Van festivals tot bedrijfsevents, wij leveren de perfecte structuren voor uw evenement. Onze oplossingen zijn snel te plaatsen, veilig en kunnen volledig naar wens worden aangepast.',
    textBlocks: [
      {
        title: 'Flexibele Oplossingen',
        content: 'Of het nu gaat om een tijdelijk festival of een permanent evenementencomplex, wij bieden de juiste oplossing. Onze structuren zijn snel te plaatsen en volledig aan te passen aan uw wensen.'
      }
    ],
    featuresLabel: 'DIENSTEN',
    featuresTitle: 'De voordelen van tijdelijke sportvoorzieningen door Envicon',
    featuresSubtitle: 'Flexibele en representatieve structuren voor evenementen van elke omvang',
    features: [
      {
        title: 'Betrouwbare samenwerking',
        description: 'Eén vaste partner die met je meedenkt en eerlijk advies geeft.',
        icon: 'concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Professionele uitstraling',
        description: 'De representatieve uitstraling van een permanente sporthal.',
        icon: 'speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Flexibel in gebruiksduur',
        description: 'Te gebruiken van enkele maanden tot meerdere jaren.',
        icon: 'eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Comfort en kwaliteit',
        description: 'Comfortabel sporten dankzij goede isolatie en optimale akoestiek.',
        icon: 'concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      }
    ],
    solutionsTitle: 'Onze modulaire oplossingen voor tijdelijke sportvoorzieningen',
    solutionsDescription: 'Met onze modulaire gebouwen ontwikkelen we in korte tijd een flexibele oplossing voor jouw sportlocatie. Van een extra kleedruimte naast het voetbalveld tot een compleet sportcomplex met verschillende faciliteiten.',
    solutionsBlockNumber: 4
  },
  {
    title: 'Landbouw',
    slug: 'landbouw',
    category: 'SECTOR',
    description: 'Duurzame agrarische bouwoplossingen voor moderne boerderijen.',
    order: 3,
    contentLabel: 'OVER LANDBOUW',
    contentTitle: 'Landbouw Oplossingen',
    contentSubtitle: 'Speciaal ontworpen voor de agrarische sector. Onze structuren bieden optimale bescherming voor uw machines, oogst en vee.',
    textBlocks: [
      {
        title: 'Duurzame Agrarische Bouw',
        content: 'Wij begrijpen de specifieke eisen van de landbouwsector. Van schuren tot kassen, onze oplossingen zijn robuust, duurzaam en perfect afgestemd op het agrarische bedrijf.'
      }
    ],
    featuresLabel: 'DIENSTEN',
    featuresTitle: 'Onze Landbouw Oplossingen',
    featuresSubtitle: 'Duurzame en functionele bouwoplossingen voor de agrarische sector',
    features: [
      {
        title: 'Schuren',
        description: 'Ruime schuren voor machines en opslag.',
        icon: 'concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Stallen',
        description: 'Comfortabele en hygiënische huisvesting voor vee.',
        icon: 'speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Kassen',
        description: 'Gecontroleerde omgevingen voor groententeelt.',
        icon: 'eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      },
      {
        title: 'Opslagruimtes',
        description: 'Veilige opslag voor oogst, voer en materialen.',
        icon: 'concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1'
      }
    ],
    solutionsTitle: 'Onze modulaire oplossingen voor de landbouw',
    solutionsDescription: 'Met onze modulaire gebouwen ontwikkelen we in korte tijd een flexibele oplossing voor jouw agrarische bedrijf. Van schuren tot kassen met verschillende faciliteiten.',
    solutionsBlockNumber: 4
  }
];

// Sample Projects Data
const projects = [
  {
    title: 'Industriële Hal Rotterdam',
    slug: 'industriele-hal-rotterdam',
    description: 'Een moderne, duurzame industriële hal van 2.500m² voor productie en opslag in het hart van Rotterdam.',
    sector: 'Industrie',
    client: 'ABC Manufacturing B.V.',
    location: 'Rotterdam, Nederland',
    year: '2023',
    content: `<h3>Over dit Project</h3>
<p>Voor ABC Manufacturing hebben wij een complete industriële hal gerealiseerd die perfect aansluit bij hun productieprocessen. De hal biedt niet alleen voldoende ruimte voor productie, maar ook voor opslag en logistiek.</p>
<h3>Uitdagingen</h3>
<p>Het project moest binnen een strakke planning worden gerealiseerd om de bedrijfsvoering niet te verstoren. Daarnaast waren er specifieke eisen op het gebied van ventilatie en verlichting.</p>
<h3>Oplossing</h3>
<p>Door gebruik te maken van onze demontabele bouwmethode konden we de hal snel en efficiënt realiseren. De modulaire opzet maakt toekomstige uitbreidingen eenvoudig mogelijk.</p>`,
    featured: true,
    order: 1
  },
  {
    title: 'Productiehal Eindhoven',
    slug: 'productiehal-eindhoven',
    description: 'Moderne productiehal met state-of-the-art klimaatbeheersing en energiezuinige verlichting.',
    sector: 'Industrie',
    client: 'TechCorp Industries',
    location: 'Eindhoven, Nederland',
    year: '2023',
    content: `<h3>Over dit Project</h3>
<p>Een ultramoderne productiehal met focus op energie-efficiëntie en werkcomfort.</p>`,
    featured: false,
    order: 2
  },
  {
    title: 'Opslagfaciliteit Amsterdam',
    slug: 'opslagfaciliteit-amsterdam',
    description: 'Grootschalige opslagfaciliteit met geautomatiseerd magazijnsysteem.',
    sector: 'Industrie',
    client: 'LogiPartners',
    location: 'Amsterdam, Nederland',
    year: '2022',
    content: `<h3>Over dit Project</h3>
<p>Efficiënte opslagoplossing voor logistiek bedrijf met geautomatiseerd systeem.</p>`,
    featured: false,
    order: 3
  },
  {
    title: 'Festival Tent Amsterdam',
    slug: 'festival-tent-amsterdam',
    description: 'Grote evenemententent voor 5.000+ bezoekers tijdens Amsterdam Music Festival.',
    sector: 'Evenementen',
    client: 'Amsterdam Events',
    location: 'Amsterdam, Nederland',
    year: '2023',
    content: `<h3>Over dit Project</h3>
<p>Voor het jaarlijkse Amsterdam Music Festival hebben wij een grote evenemententent geleverd die ruimte bood aan meer dan 5.000 bezoekers.</p>
<h3>Specificaties</h3>
<p>De tent was uitgerust met professionele verlichting, geluidsisolatie en klimaatbeheersing voor optimaal comfort.</p>`,
    featured: true,
    order: 4
  },
  {
    title: 'Beurstand Utrecht',
    slug: 'beurstand-utrecht',
    description: 'Modulaire beurstand voor de grootste vakbeurs van Nederland.',
    sector: 'Evenementen',
    client: 'Jaarbeurs Utrecht',
    location: 'Utrecht, Nederland',
    year: '2023',
    content: `<h3>Over dit Project</h3>
<p>Modulaire en flexibele beurstand voor grote vakbeurs.</p>`,
    featured: false,
    order: 5
  },
  {
    title: 'Sportevenement Den Haag',
    slug: 'sportevenement-den-haag',
    description: 'Tijdelijke accommodatie voor groot sportevenement met 10.000 bezoekers.',
    sector: 'Evenementen',
    client: 'Sport Events NL',
    location: 'Den Haag, Nederland',
    year: '2023',
    content: `<h3>Over dit Project</h3>
<p>Tijdelijke sportaccommodatie voor grootschalig evenement.</p>`,
    featured: false,
    order: 6
  },
  {
    title: 'Agrarische Schuur Friesland',
    slug: 'agrarische-schuur-friesland',
    description: 'Moderne schuur voor melkveehouderij met optimale ventilatie.',
    sector: 'Landbouw',
    client: 'Boerderij De Groene Weide',
    location: 'Leeuwarden, Nederland',
    year: '2023',
    content: `<h3>Over dit Project</h3>
<p>Moderne agrarische schuur met focus op dierenwelzijn en ventilatie.</p>`,
    featured: false,
    order: 7
  },
  {
    title: 'Kascomplex Westland',
    slug: 'kas-westland',
    description: 'Geavanceerd kascomplex voor duurzame groententeelt.',
    sector: 'Landbouw',
    client: 'Westland Tomaten',
    location: 'Westland, Nederland',
    year: '2022',
    content: `<h3>Over dit Project</h3>
<p>Modern kascomplex met geavanceerde klimaatbeheersing voor duurzame teelt.</p>`,
    featured: true,
    order: 8
  }
];

async function fetchAPI(path, options = {}) {
  const url = `${STRAPI_URL}/api${path}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(STRAPI_API_TOKEN && { 'Authorization': `Bearer ${STRAPI_API_TOKEN}` })
    }
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed');
  }

  return data;
}

async function importSectors() {
  console.log('\n📦 Importing sectors...\n');
  
  for (const sector of sectors) {
    try {
      const response = await fetchAPI('/sectors', {
        method: 'POST',
        body: JSON.stringify({ data: sector })
      });
      
      console.log(`✅ Created sector: ${sector.title}`);
      
      // Publish the sector
      const documentId = response.data.documentId || response.data.id;
      await fetchAPI(`/sectors/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } })
      });
      
      console.log(`✅ Published sector: ${sector.title}`);
    } catch (error) {
      console.error(`❌ Failed to import sector ${sector.title}:`, error.message);
    }
  }
}

async function importProjects() {
  console.log('\n📦 Importing projects...\n');
  
  for (const project of projects) {
    try {
      const response = await fetchAPI('/projects', {
        method: 'POST',
        body: JSON.stringify({ data: project })
      });
      
      console.log(`✅ Created project: ${project.title}`);
      
      // Publish the project
      const documentId = response.data.documentId || response.data.id;
      await fetchAPI(`/projects/${documentId}`, {
        method: 'PUT',
        body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } })
      });
      
      console.log(`✅ Published project: ${project.title}`);
    } catch (error) {
      console.error(`❌ Failed to import project ${project.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting import process...');
  console.log(`📍 Strapi URL: ${STRAPI_URL}`);
  
  try {
    await importSectors();
    await importProjects();
    
    console.log('\n✅ Import completed successfully!\n');
    console.log('Next steps:');
    console.log('1. Go to Strapi admin: http://localhost:1337/admin');
    console.log('2. Link solutions to sectors if needed');
    console.log('3. Upload images for sectors and projects');
    console.log('4. Visit your Next.js site to see the pages!');
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  }
}

main();





