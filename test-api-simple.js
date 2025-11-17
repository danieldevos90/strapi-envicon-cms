#!/usr/bin/env node

const API_TOKEN = '7f31d7c2e9b36a7dd6471d314717d4856af577d88cca7b88e8d0f2c5d823807e0e073316ad6e70a6ae31e575b80d78564f0e72249d8ff3225c8bb616616fe6e83c5402a75a2b76262576792b6a39ba339dcc82f98ae738bfb00da94646d697d8ee23942768182d428dddf4e0270cee80ca297d7f1134da9c76db9186a024606d';
const STRAPI_URL = 'http://localhost:1337';

async function testAPI() {
  console.log('🧪 Testing API...');
  
  try {
    // Test homepage
    console.log('Testing homepage...');
    const response = await fetch(`${STRAPI_URL}/api/homepage`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    // Try to create homepage content
    console.log('\nTrying to create homepage...');
    const createResponse = await fetch(`${STRAPI_URL}/api/homepage`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          heroTitle: "Test Title",
          heroDescription: "Test Description",
          publishedAt: new Date().toISOString()
        }
      })
    });
    
    console.log('Create response status:', createResponse.status);
    const createData = await createResponse.json();
    console.log('Create response data:', JSON.stringify(createData, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
