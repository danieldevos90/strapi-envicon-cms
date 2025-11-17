/**
 * Debug API - Get detailed error information
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const API_URL = `${STRAPI_URL}/api`;

async function debugAPI() {
  try {
    console.log('🔍 Debugging API population...\n');
    
    // Step 1: Get current sector structure
    console.log('📋 Step 1: Getting current sector structure...');
    const getResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs`);
    
    if (!getResponse.data.data || getResponse.data.data.length === 0) {
      console.log('❌ Sector not found');
      return;
    }
    
    const sector = getResponse.data.data[0];
    console.log('✅ Found sector:', sector.title);
    console.log('📄 DocumentId:', sector.documentId);
    console.log('📄 Current structure:', JSON.stringify(Object.keys(sector), null, 2));
    
    // Step 2: Try minimal sectorContent update
    console.log('\n📋 Step 2: Testing minimal sectorContent update...');
    const minimalData = {
      data: {
        sectorContent: {
          title: "Test Title",
          description: "Test Description"
        }
      }
    };
    
    try {
      const updateResponse = await axios.put(`${API_URL}/sectors/${sector.documentId}`, minimalData);
      console.log('✅ Minimal update successful!');
      console.log('📄 Response:', JSON.stringify(updateResponse.data.data, null, 2));
    } catch (error) {
      console.log('❌ Minimal update failed');
      console.log('📄 Error details:', JSON.stringify(error.response?.data, null, 2));
    }
    
    // Step 3: Try with all required fields
    console.log('\n📋 Step 3: Testing with all required fields...');
    const fullData = {
      data: {
        sectorContent: {
          title: "Snel een oplossing voor jouw schoolgebouw",
          description: "Als school wil je dat de lessen gewoon door kunnen blijven gaan.",
          additionalText: "De tijdelijke gebouwen kunnen wij realiseren.",
          features: ["Feature 1", "Feature 2"],
          imageAlt: "Modulaire schoolgebouw unit"
        }
      }
    };
    
    try {
      const updateResponse2 = await axios.put(`${API_URL}/sectors/${sector.documentId}`, fullData);
      console.log('✅ Full update successful!');
      
      // Verify it was saved
      const verifyResponse = await axios.get(`${API_URL}/sectors?filters[slug]=onderwijs&populate[sectorContent]=*`);
      const updatedSector = verifyResponse.data.data[0];
      console.log('📄 SectorContent after update:', updatedSector.sectorContent ? '✅ Present' : '❌ Missing');
      
      if (updatedSector.sectorContent) {
        console.log('📄 Content:', JSON.stringify(updatedSector.sectorContent, null, 2));
      }
    } catch (error) {
      console.log('❌ Full update failed');
      console.log('📄 Error status:', error.response?.status);
      console.log('📄 Error message:', error.response?.data?.error?.message);
      console.log('📄 Error details:', JSON.stringify(error.response?.data?.error?.details, null, 2));
    }
    
    // Step 4: Try with sectorFeatures
    console.log('\n📋 Step 4: Testing sectorFeatures...');
    const featuresData = {
      data: {
        sectorFeatures: {
          title: "De voordelen van onderwijshuisvesting door Envicon",
          features: [
            {
              icon: "settings",
              title: "Flexibel inzetbaar",
              description: "Als uitbreiding van een permanent schoolgebouw."
            }
          ]
        }
      }
    };
    
    try {
      const updateResponse3 = await axios.put(`${API_URL}/sectors/${sector.documentId}`, featuresData);
      console.log('✅ Features update successful!');
    } catch (error) {
      console.log('❌ Features update failed');
      console.log('📄 Error:', error.response?.data?.error?.message);
      console.log('📄 Details:', JSON.stringify(error.response?.data?.error?.details, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error.message);
    console.log('📄 Full error:', error.response?.data || error);
  }
}

debugAPI();
