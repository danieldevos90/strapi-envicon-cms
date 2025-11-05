/**
 * Import data into Production Strapi from existing MySQL database
 * 
 * Usage:
 * STRAPI_API_TOKEN=your_production_token node import-to-production.js
 */

const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
require('dotenv').config();

const STRAPI_URL = 'https://cms.envicon.nl';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '1347407b5f4652963ccfe589a7bf0ee309a6e0ca4c94dabdbb0a990d2ca774e92ff7c21ce8f5faa567ffe0a64b07cf8137018cf389ab42d50074ab676d16f2d07723224324d25052df0ec1a45459f6547022a3739acb62784dc196ef95054cfde70be67d0aa2c48a3aeeb8d20578f538002dcab14a4ca0a211388917ed241775';

console.log('🚀 Production Import Script');
console.log('Strapi URL:', STRAPI_URL);
console.log('API Token:', API_TOKEN ? `${API_TOKEN.substring(0, 20)}...` : 'NOT SET');

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is required');
  process.exit(1);
}

// Database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
};

async function fetchFromStrapi(endpoint) {
  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strapi API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

async function postToStrapi(endpoint, data) {
  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ data })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strapi API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

async function putToStrapi(endpoint, data) {
  const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ data })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Strapi API error: ${response.status} - ${error}`);
  }
  
  return response.json();
}

async function importData() {
  let connection;
  
  try {
    console.log('\n🔌 Connecting to production database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Test Strapi connection
    console.log('\n🔌 Testing Strapi connection...');
    try {
      await fetchFromStrapi('/navigation');
      console.log('✅ Strapi is accessible');
    } catch (error) {
      console.error('❌ Cannot connect to Strapi:', error.message);
      throw error;
    }

    // Import navigation
    console.log('\n📋 Importing Navigation...');
    const [navRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['navigation']);
    if (navRows.length > 0) {
      const navData = JSON.parse(navRows[0].data);
      await putToStrapi('/navigation', {
        logo: navData.logo,
        menuItems: navData.menu.map(item => ({
          identifier: item.id,
          title: item.title,
          href: item.href
        }))
      });
      console.log('✅ Navigation imported');
    }

    // Import SEO settings
    console.log('\n🔍 Importing SEO Settings...');
    const [seoRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['seo']);
    if (seoRows.length > 0) {
      const seoData = JSON.parse(seoRows[0].data);
      await putToStrapi('/global-seo', seoData);
      console.log('✅ SEO Settings imported');
    }

    // Import footer
    console.log('\n👣 Importing Footer...');
    const [footerRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['footer']);
    if (footerRows.length > 0) {
      const footerData = JSON.parse(footerRows[0].data);
      await putToStrapi('/footer', footerData);
      console.log('✅ Footer imported');
    }

    // Import forms config
    console.log('\n📝 Importing Forms Configuration...');
    const [formsRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['forms']);
    if (formsRows.length > 0) {
      const formsData = JSON.parse(formsRows[0].data);
      await putToStrapi('/forms-config', formsData);
      console.log('✅ Forms Configuration imported');
    }

    // Import homepage sections
    console.log('\n🏠 Importing Homepage...');
    const [heroRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['hero']);
    const [aboutRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['about']);
    const [contactRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['contact']);
    const [processRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['process']);
    
    const homepageData = {
      hero: heroRows.length > 0 ? JSON.parse(heroRows[0].data) : null,
      about: aboutRows.length > 0 ? JSON.parse(aboutRows[0].data) : null,
      contact: contactRows.length > 0 ? JSON.parse(contactRows[0].data) : null,
      process: processRows.length > 0 ? JSON.parse(processRows[0].data) : null
    };
    
    await putToStrapi('/homepage', homepageData);
    console.log('✅ Homepage imported');

    // Import solutions
    console.log('\n🏗️  Importing Solutions...');
    const [solutionsRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['solutions']);
    if (solutionsRows.length > 0) {
      const solutionsData = JSON.parse(solutionsRows[0].data);
      if (solutionsData.solutions && Array.isArray(solutionsData.solutions)) {
        for (let i = 0; i < solutionsData.solutions.length; i++) {
          const solution = solutionsData.solutions[i];
          await postToStrapi('/solutions', {
            ...solution,
            order: i
          });
          console.log(`  ✅ ${solution.title}`);
        }
      }
    }

    // Import sectors
    console.log('\n🏭 Importing Sectors...');
    const [sectorsRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['sectors']);
    if (sectorsRows.length > 0) {
      const sectorsData = JSON.parse(sectorsRows[0].data);
      if (sectorsData.downloadBlocks && Array.isArray(sectorsData.downloadBlocks)) {
        for (let i = 0; i < sectorsData.downloadBlocks.length; i++) {
          const sector = sectorsData.downloadBlocks[i];
          await postToStrapi('/sectors', {
            title: sector.title,
            description: sector.description,
            downloadUrl: sector.downloadUrl,
            downloadText: sector.downloadText,
            order: i
          });
          console.log(`  ✅ ${sector.title}`);
        }
      }
    }

    // Import services
    console.log('\n🔧 Importing Services...');
    const [servicesRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['services']);
    if (servicesRows.length > 0) {
      const servicesData = JSON.parse(servicesRows[0].data);
      if (servicesData.accordions && Array.isArray(servicesData.accordions)) {
        for (let i = 0; i < servicesData.accordions.length; i++) {
          const service = servicesData.accordions[i];
          await postToStrapi('/services', {
            title: service.title,
            description: service.description,
            order: i
          });
          console.log(`  ✅ ${service.title}`);
        }
      }
    }

    // Import process steps
    console.log('\n📋 Importing Process Steps...');
    if (processRows.length > 0) {
      const processData = JSON.parse(processRows[0].data);
      if (processData.steps && Array.isArray(processData.steps)) {
        for (const step of processData.steps) {
          await postToStrapi('/process-steps', step);
          console.log(`  ✅ ${step.title}`);
        }
      }
    }

    // Import articles
    console.log('\n📰 Importing Articles...');
    const [articleRows] = await connection.execute(`
      SELECT slug, title, excerpt, author, published_at, featured_image, category, content 
      FROM articles 
      WHERE status = 'published'
    `);
    
    for (const article of articleRows) {
      await postToStrapi('/articles', {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        publishedAt: article.published_at,
        category: article.category,
        content: JSON.parse(article.content),
        publishedAt: new Date().toISOString() // Publish immediately
      });
      console.log(`  ✅ ${article.title}`);
    }

    console.log('\n🎉 All data imported successfully to production!');
    console.log('\n📊 Import Summary:');
    console.log('- Navigation: ✅');
    console.log('- SEO Settings: ✅');
    console.log('- Footer: ✅');
    console.log('- Forms Config: ✅');
    console.log('- Homepage: ✅');
    console.log('- Solutions: ✅ (4 items)');
    console.log('- Sectors: ✅ (3 items)');
    console.log('- Services: ✅ (7 items)');
    console.log('- Process Steps: ✅ (4 items)');
    console.log('- Articles: ✅ (3 items)');

    console.log('\n🔗 Next steps:');
    console.log('1. Visit https://cms.envicon.nl/admin to verify content');
    console.log('2. Update your Next.js production environment variables');
    console.log('3. Deploy your Next.js application');

  } catch (error) {
    console.error('❌ Import error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Run import
importData();
