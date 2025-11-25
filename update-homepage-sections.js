/**
 * Script to update Homepage with section titles
 * This adds the new section title components to the homepage
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_URL = `${STRAPI_URL}/api`;

async function fetchAPI(path, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  const requestUrl = `${STRAPI_API_URL}${path}`;
  
  const response = await fetch(requestUrl, mergedOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}\n${errorText}`);
  }

  return await response.json();
}

async function updateHomepage() {
  console.log('📝 Updating homepage with section titles...\n');

  try {
    // First, get the current homepage data
    console.log('1️⃣ Fetching current homepage data...');
    const currentData = await fetchAPI('/homepage?populate=*');
    console.log('✅ Current homepage data fetched\n');

    // Prepare the updated data with new section components
    const updatedData = {
      data: {
        about: currentData.data?.about || {
          subtitle: 'OVER ENVICON',
          title: 'Jouw partner in duurzaam en efficiënt bouwen',
          description: 'Envicon levert hoogwaardige bouwoplossingen voor alle soorten projecten',
          features: []
        },
        solutions: {
          subtitle: 'OPLOSSINGEN',
          title: 'Welke oplossing past bij jouw project?',
          description: 'Ontdek onze verschillende bouwoplossingen voor elk type project'
        },
        articles: {
          subtitle: 'NIEUWSBERICHTEN',
          title: 'Nieuws en projecten',
          description: ''
        },
        sectors: {
          subtitle: 'SECTOREN',
          title: 'Ontdek maatwerk voor jouw sector',
          description: 'Wij bieden oplossingen voor verschillende sectoren'
        },
        services: {
          subtitle: 'DIENSTEN',
          title: 'Volledige ontzorging voor jouw bouwproject',
          description: 'Met Envicon ben je verzekerd van een hassle-free project'
        },
        process: currentData.data?.process || {
          subtitle: 'PROCES',
          title: 'Hoe we samenwerken',
          description: 'Van ontwerp tot oplevering'
        },
        hero: currentData.data?.hero || {},
        contact: currentData.data?.contact || {}
      }
    };

    // Update the homepage
    console.log('2️⃣ Updating homepage with new section titles...');
    await fetchAPI('/homepage', {
      method: 'PUT',
      body: JSON.stringify(updatedData)
    });
    console.log('✅ Homepage updated successfully!\n');

    console.log('🎉 Migration complete!');
    console.log('\n📋 New section titles added:');
    console.log('   - About: OVER ENVICON / Jouw partner in duurzaam en efficiënt bouwen');
    console.log('   - Solutions: OPLOSSINGEN / Welke oplossing past bij jouw project?');
    console.log('   - Articles: NIEUWSBERICHTEN / Nieuws en projecten');
    console.log('   - Sectors: SECTOREN / Ontdek maatwerk voor jouw sector');
    console.log('   - Services: DIENSTEN / Volledige ontzorging voor jouw bouwproject');
    console.log('\n💡 You can now edit these titles in the Strapi admin panel!');

  } catch (error) {
    console.error('❌ Error updating homepage:', error.message);
    process.exit(1);
  }
}

// Run the migration
updateHomepage();





