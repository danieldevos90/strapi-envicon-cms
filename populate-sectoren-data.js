/**
 * Populate Sectoren Sample Data
 * 
 * This script adds sample data for the new sectoren page structure
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

console.log('🚀 Populating sectoren sample data...');
console.log('📡 Strapi URL:', STRAPI_URL);

// Sample data for Onderwijs sector
const sampleSectorData = {
  data: {
    title: "Onderwijs",
    slug: "onderwijs", 
    description: "Tijdelijke onderwijshuisvesting voor scholen en educatieve instellingen",
    category: "SECTOR",
    order: 1,
    
    sectorContent: {
      title: "Snel een oplossing voor jouw schoolgebouw",
      description: "Als school wil je dat de lessen gewoon door kunnen blijven gaan. Daarom bouwen we snel en met zo min mogelijk overlast. Onze modulaire units en demontabele bouwsystemen zijn eenvoudig aan te passen als het aantal leerlingen verandert. We leveren ze gebruiksklaar op met verlichting, sanitair en garderobes.",
      additionalText: "De tijdelijke gebouwen kunnen wij realiseren volgens het Programma van Eisen Frisse Scholen (klasse B of C). Daarmee creëren we een gezonde, veilige en energiezuinige leeromgeving met:",
      features: [
        { text: "Gebalanceerde ventilatie met CO₂-sturing" },
        { text: "Veel daglicht en goed akoestisch comfort" },
        { text: "Energiezuinige installaties" },
        { text: "Een aangenaam binnenklimaat" }
      ],
      imageAlt: "Modulaire schoolgebouw unit"
    },
    
    sectorFeatures: {
      title: "De voordelen van onderwijshuisvesting door Envicon",
      features: [
        {
          icon: "settings",
          title: "Flexibel inzetbaar",
          description: "Als uitbreiding van een permanent schoolgebouw of dependance."
        },
        {
          icon: "check",
          title: "Comfortabel in elk seizoen",
          description: "Dankzij slimme klimaatbeheersing is de ruimte comfortabel in elk seizoen."
        },
        {
          icon: "volume2",
          title: "Goede akoestiek",
          description: "Goede akoestiek zorgt voor rust in de klas en een fijne leeromgeving."
        },
        {
          icon: "building",
          title: "Meer dan alleen het gebouw",
          description: "We denken verder dan het gebouw, zoals een extra fietsenhok of speeltuin."
        }
      ]
    },
    
    sectorAccordions: {
      title: "Onze modulaire oplossingen voor het onderwijs",
      description: "We bieden diverse oplossingen voor tijdelijke onderwijshuisvesting. Van een paar extra noodlokalen tot uitbreiding van een campus, met onze jarenlange ervaring weten we precies wat er nodig is om snel en soepel te bouwen.",
      accordions: [
        {
          title: "Noodlokaal",
          content: "Tijdelijke klaslokalen die snel geplaatst kunnen worden bij acute ruimtenood."
        },
        {
          title: "Gymzaal",
          content: "Modulaire sportfaciliteiten voor lichamelijke opvoeding en schoolsport."
        },
        {
          title: "Kantine",
          content: "Eetruimtes en keukenfaciliteiten voor schoolmaaltijden en pauzes."
        },
        {
          title: "Kinderopvang",
          content: "Veilige en kindvriendelijke ruimtes voor voor- en naschoolse opvang."
        }
      ],
      imageAlt: "Modulaire gymzaal voor onderwijs"
    }
  }
};

async function populateData() {
  try {
    console.log('\n📝 Creating/updating Onderwijs sector...');
    
    // First, try to find existing sector
    const existingResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs`);
    
    if (existingResponse.data.data && existingResponse.data.data.length > 0) {
      // Update existing sector
      const sectorId = existingResponse.data.data[0].id;
      console.log(`🔄 Updating existing sector with ID: ${sectorId}`);
      
      const updateResponse = await axios.put(`${API_URL}/sectors/${sectorId}`, sampleSectorData);
      console.log('✅ Sector updated successfully!');
      
    } else {
      // Create new sector
      console.log('➕ Creating new sector...');
      
      const createResponse = await axios.post(`${API_URL}/sectors`, sampleSectorData);
      console.log('✅ Sector created successfully!');
    }
    
    console.log('\n🎉 Sample data population complete!');
    console.log('💡 You can now test the sectoren page with dynamic content.');
    
  } catch (error) {
    console.error('❌ Error populating data:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Make sure Strapi is running');
    console.log('   - Ensure the content types have been built');
    console.log('   - Check if the API is accessible');
  }
}

populateData();
