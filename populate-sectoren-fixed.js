/**
 * Populate Sectoren Data - Fixed Version
 * Uses proper component structure for Strapi v5
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const API_URL = `${STRAPI_URL}/api`;

console.log('🚀 Populating sectoren sample data...');
console.log('📡 Strapi URL:', STRAPI_URL);

// Complete sample data with proper component structure
const sampleSectorData = {
  data: {
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
    console.log('\n📝 Finding Onderwijs sector...');
    
    // Get existing sector
    const existingResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs`);
    
    if (!existingResponse.data.data || existingResponse.data.data.length === 0) {
      console.log('❌ Onderwijs sector not found');
      return;
    }
    
    const sector = existingResponse.data.data[0];
    const documentId = sector.documentId;
    console.log(`✅ Found sector: ${sector.title} (${documentId})`);
    
    // Update sector with all new components
    console.log('\n🔄 Updating sector with new component data...');
    const updateResponse = await axios.put(`${API_URL}/sectors/${documentId}`, sampleSectorData);
    
    console.log('✅ Sector updated successfully!');
    console.log('📋 Updated:', updateResponse.data.data.title);
    
    // Verify the update
    console.log('\n🧪 Verifying updated data...');
    const verifyResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs&populate[sectorContent][populate]=*&populate[sectorFeatures][populate]=*&populate[sectorAccordions][populate]=*`);
    
    if (verifyResponse.data.data && verifyResponse.data.data.length > 0) {
      const updatedSector = verifyResponse.data.data[0];
      console.log('\n✅ Verification Results:');
      console.log('  - SectorContent:', updatedSector.sectorContent ? '✅ Available' : '❌ Missing');
      if (updatedSector.sectorContent) {
        console.log('    Title:', updatedSector.sectorContent.title);
        console.log('    Features:', updatedSector.sectorContent.features?.length || 0, 'items');
      }
      
      console.log('  - SectorFeatures:', updatedSector.sectorFeatures ? '✅ Available' : '❌ Missing');
      if (updatedSector.sectorFeatures) {
        console.log('    Title:', updatedSector.sectorFeatures.title);
        console.log('    Features:', updatedSector.sectorFeatures.features?.length || 0, 'items');
      }
      
      console.log('  - SectorAccordions:', updatedSector.sectorAccordions ? '✅ Available' : '❌ Missing');
      if (updatedSector.sectorAccordions) {
        console.log('    Title:', updatedSector.sectorAccordions.title);
        console.log('    Accordions:', updatedSector.sectorAccordions.accordions?.length || 0, 'items');
      }
    }
    
    console.log('\n🎉 Population complete!');
    console.log('💡 The sectoren page should now display dynamic content!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.error?.message || error.message);
    
    if (error.response?.data?.error?.details) {
      console.log('\n📄 Error Details:');
      console.log(JSON.stringify(error.response.data.error.details, null, 2));
    }
    
    if (error.response?.data?.error?.errors) {
      console.log('\n📄 Validation Errors:');
      error.response.data.error.errors.forEach((err, index) => {
        console.log(`  ${index + 1}. ${err.path.join('.')}: ${err.message}`);
      });
    }
  }
}

populateData();
