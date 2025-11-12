/**
 * Simple Sector Population - Step by Step
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

console.log('🚀 Simple sectoren population...');
console.log('📡 Strapi URL:', STRAPI_URL);

// Simple test data - just sectorContent first
const simpleSectorData = {
  data: {
    sectorContent: {
      title: "Snel een oplossing voor jouw schoolgebouw",
      description: "Als school wil je dat de lessen gewoon door kunnen blijven gaan. Daarom bouwen we snel en met zo min mogelijk overlast.",
      additionalText: "De tijdelijke gebouwen kunnen wij realiseren volgens het Programma van Eisen Frisse Scholen.",
      features: [
        "Gebalanceerde ventilatie met CO₂-sturing",
        "Veel daglicht en goed akoestisch comfort"
      ],
      imageAlt: "Modulaire schoolgebouw unit"
    }
  }
};

async function populateSimple() {
  try {
    console.log('\n📝 Finding Onderwijs sector...');
    
    // Get existing sector
    const existingResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs`);
    
    if (existingResponse.data.data && existingResponse.data.data.length > 0) {
      const sector = existingResponse.data.data[0];
      const documentId = sector.documentId;
      console.log(`✅ Found sector: ${sector.title} (${documentId})`);
      
      console.log('\n🔄 Updating with sectorContent...');
      const updateResponse = await axios.put(`${API_URL}/sectors/${documentId}`, simpleSectorData);
      
      console.log('✅ Update successful!');
      console.log('📋 Response:', updateResponse.data.data.title);
      
      // Test the result
      console.log('\n🧪 Testing updated sector...');
      const testResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs&populate[sectorContent]=*`);
      
      if (testResponse.data.data && testResponse.data.data.length > 0) {
        const updatedSector = testResponse.data.data[0];
        console.log('✅ Verification:');
        console.log('  - SectorContent:', updatedSector.sectorContent ? '✅ Available' : '❌ Missing');
        
        if (updatedSector.sectorContent) {
          console.log('  - Title:', updatedSector.sectorContent.title);
          console.log('  - Features:', updatedSector.sectorContent.features?.length || 0, 'items');
        }
      }
      
    } else {
      console.log('❌ Onderwijs sector not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

populateSimple();
