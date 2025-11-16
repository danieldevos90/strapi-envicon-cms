/**
 * Populate Solutions Content via Strapi API
 * 
 * This script creates/updates solutions with slugs in Strapi
 */

const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const API_TOKEN = process.env.STRAPI_API_TOKEN || process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is required');
  console.log('');
  console.log('Usage:');
  console.log('  STRAPI_API_TOKEN=your_token_here node populate-solutions.js');
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

// Default solutions to create/update
const defaultSolutions = [
  {
    title: "Demontabel",
    description: "Demontabele bouwoplossingen die volledig herbruikbaar zijn.",
    slug: "demontabel",
    order: 1
  },
  {
    title: "Overkapping",
    description: "Modulaire overkappingen voor diverse toepassingen.",
    slug: "overkapping",
    order: 2
  },
  {
    title: "Modulaire",
    description: "Flexibele modulaire bouwoplossingen op maat.",
    slug: "modulaire",
    order: 3
  },
  {
    title: "Loods",
    description: "Ruime loodsen voor opslag en werkruimte.",
    slug: "loods",
    order: 4
  }
];

async function populateSolutions() {
  console.log('🚀 Populating Solutions content...');
  console.log('📡 Strapi URL:', STRAPI_URL);
  console.log('');

  try {
    // Get existing solutions
    const existingResponse = await api.get('/solutions?populate=*');
    const existingSolutions = existingResponse.data.data || [];
    console.log(`📄 Found ${existingSolutions.length} existing solutions`);

    // Process each default solution
    for (const solutionData of defaultSolutions) {
      // Check if solution already exists (by slug or title)
      const existing = existingSolutions.find(s => {
        const attrs = s.attributes || s;
        return attrs.slug === solutionData.slug || attrs.title === solutionData.title;
      });

      const solutionPayload = {
        data: {
          ...solutionData,
          publishedAt: new Date().toISOString()
        }
      };

      if (existing) {
        console.log(`🔄 Updating solution: ${solutionData.title}`);
        await api.put(`/solutions/${existing.id}`, solutionPayload);
      } else {
        console.log(`✨ Creating solution: ${solutionData.title}`);
        await api.post('/solutions', solutionPayload);
      }
    }

    console.log('');
    console.log('✅ Solutions populated successfully!');
    console.log('');

    console.log('📝 Next steps:');
    console.log('   1. Go to https://cms.envicon.nl/admin');
    console.log('   2. Content Manager → Solution');
    console.log('   3. Edit each solution:');
    console.log('      - Upload images/icons');
    console.log('      - Add rich text content');
    console.log('      - Add SEO metadata');
    console.log('   4. Verify slugs are correct');
    console.log('   5. Publish all solutions');
    console.log('');

  } catch (error) {
    console.error('❌ Error populating solutions:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

// Run the script
populateSolutions();

