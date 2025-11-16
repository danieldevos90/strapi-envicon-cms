/**
 * Populate About Page Content via Strapi API
 * 
 * This script fills the About page with default content using the Strapi API
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is required');
  console.log('');
  console.log('Usage:');
  console.log('  STRAPI_API_TOKEN=your_token_here node populate-about-page.js');
  console.log('');
  console.log('To get an API token:');
  console.log('  1. Go to https://cms.envicon.nl/admin');
  console.log('  2. Settings → API Tokens → Create new API Token');
  console.log('  3. Token type: Full access');
  console.log('  4. Copy the token and use it in the command above');
  process.exit(1);
}

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function populateAboutPage() {
  console.log('🚀 Populating About page content...');
  console.log('📡 Strapi URL:', STRAPI_URL);
  console.log('');

  try {
    // About page content structure
    const aboutPageData = {
      data: {
        hero: {
          title: "Over Envicon",
          backgroundImage: null, // Will need to be uploaded via Strapi admin
          alt: "Envicon - Duurzame bouwoplossingen"
        },
        ourStory: {
          title: "Onze Verhaal",
          description: "Envicon is een toonaangevende leverancier van modulaire en demontabele bouwoplossingen. Met jarenlange ervaring in de bouwsector bieden wij flexibele, duurzame en kosteneffectieve oplossingen voor diverse sectoren.\n\nOnze missie is om hoogwaardige bouwoplossingen te leveren die snel te realiseren zijn, volledig herbruikbaar en voldoen aan de hoogste kwaliteitseisen.",
          image: null, // Will need to be uploaded via Strapi admin
          imageAlt: "Envicon project"
        },
        quote: {
          quote: "Duurzaam bouwen betekent niet alleen milieuvriendelijk, maar ook flexibel en toekomstbestendig."
        },
        team: {
          title: "Het Team",
          description: "Ons team bestaat uit ervaren professionals die zich inzetten voor het leveren van de beste bouwoplossingen.",
          teamMembers: [
            // Add team members here - example:
            // {
            //   name: "John Doe",
            //   description: "Project Manager",
            //   image: null,
            //   imageAlt: "John Doe"
            // }
          ]
        },
        modulairBouwer: {
          title: "Modulair Bouwer",
          description: "Als gespecialiseerde modulaire bouwer combineren wij innovatie met praktische oplossingen. Onze modules worden geprefabriceerd in onze eigen productiefaciliteit, waardoor we snelle levertijden kunnen garanderen zonder in te boeten op kwaliteit.\n\nElke module wordt met precisie gebouwd en kan volledig worden gedemonteerd en hergebruikt, wat onze oplossingen zowel kosteneffectief als duurzaam maakt.",
          image: null, // Will need to be uploaded via Strapi admin
          imageAlt: "Modulair bouwen"
        },
        certificates: {
          title: "Certificeringen & Lidmaatschappen",
          certificates: [
            // Add certificates here - example:
            // {
            //   logo: null,
            //   alt: "Certificate name"
            // }
          ]
        },
        cta: {
          title: "Interesse in een vergelijkbaar project?",
          buttonText: "Neem contact op",
          buttonType: "quote"
        },
        metaTitle: "Over Ons - Envicon",
        metaDescription: "Leer meer over Envicon en onze missie om duurzame en flexibele bouwoplossingen te leveren."
      }
    };

    // Check if About page already exists
    let existingPage;
    try {
      const response = await api.get('/about-page');
      existingPage = response.data.data;
      console.log('📄 Found existing About page');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('📄 About page does not exist yet, will create new one');
      } else {
        throw error;
      }
    }

    // Create or update the About page
    let result;
    if (existingPage) {
      console.log('🔄 Updating existing About page...');
      result = await api.put('/about-page', aboutPageData);
    } else {
      console.log('✨ Creating new About page...');
      result = await api.post('/about-page', aboutPageData);
    }

    console.log('✅ About page content populated successfully!');
    console.log('');

    // Publish the page
    try {
      await api.post('/about-page/actions/publish');
      console.log('✅ About page published successfully!');
    } catch (publishError) {
      console.log('⚠️  Note: Could not auto-publish. Please publish manually in Strapi admin.');
      console.log('   Go to: Content Manager → About Page → Publish');
    }

    console.log('');
    console.log('📝 Next steps:');
    console.log('   1. Go to https://cms.envicon.nl/admin');
    console.log('   2. Content Manager → About Page');
    console.log('   3. Upload images for:');
    console.log('      - Hero background image');
    console.log('      - Our Story image');
    console.log('      - Modulair Bouwer image');
    console.log('      - Team member photos (if any)');
    console.log('      - Certificate logos (if any)');
    console.log('   4. Add team members and certificates if needed');
    console.log('   5. Review and publish the page');
    console.log('');

  } catch (error) {
    console.error('❌ Error populating About page:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the script
populateAboutPage();

