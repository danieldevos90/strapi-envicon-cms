/**
 * Import data into Strapi from existing MySQL database
 * 
 * Prerequisites:
 * 1. Strapi must be running (npm run develop)
 * 2. Admin user must be created
 * 3. API tokens must be configured
 * 
 * Usage:
 * STRAPI_API_TOKEN=your_token_here node import-to-strapi.js
 */

const mysql = require('mysql2/promise');
const fetch = require('node-fetch');
require('dotenv').config();

const STRAPI_URL = process.env.STRAPI_ADMIN_CLIENT_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is required');
  console.log('\nTo get your API token:');
  console.log('1. Go to http://localhost:1337/admin');
  console.log('2. Settings → API Tokens → Create new API Token');
  console.log('3. Give it a name and Full access type');
  console.log('4. Copy the token and run:');
  console.log('   STRAPI_API_TOKEN=your_token node import-to-strapi.js');
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
    console.log('🔌 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Test Strapi connection
    console.log('\n🔌 Testing Strapi connection...');
    try {
      await fetchFromStrapi('/navigation');
      console.log('✅ Strapi is accessible');
    } catch (error) {
      console.error('❌ Cannot connect to Strapi. Make sure it\'s running (npm run develop)');
      throw error;
    }

    // Import navigation
    console.log('\n📋 Importing Navigation...');
    const [navRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['navigation']);
    if (navRows.length > 0) {
      const navData = JSON.parse(navRows[0].data);
      await putToStrapi('/navigation', {
        logo: navData.logo,
        menuItems: navData.menu
      });
      console.log('✅ Navigation imported');
    }

    // Import SEO settings
    console.log('\n🔍 Importing SEO Settings...');
    const [seoRows] = await connection.execute('SELECT data FROM content WHERE section = ?', ['seo']);
    if (seoRows.length > 0) {
      const seoData = JSON.parse(seoRows[0].data);
      await putToStrapi('/seo-settings', seoData);
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
        for (const solution of solutionsData.solutions) {
          await postToStrapi('/solutions', solution);
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
        let order = 0;
        for (const sector of sectorsData.downloadBlocks) {
          await postToStrapi('/sectors', {
            title: sector.title,
            description: sector.description,
            downloadUrl: sector.downloadUrl,
            downloadText: sector.downloadText,
            order: order++
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
        let order = 0;
        for (const service of servicesData.accordions) {
          await postToStrapi('/services', {
            title: service.title,
            description: service.description,
            order: order++
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

    console.log('\n✅ All data imported successfully!');
    console.log('\nNext steps:');
    console.log('1. Review the imported content in Strapi admin');
    console.log('2. Update your Next.js app to fetch from Strapi API');
    console.log('3. Test the integration');

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

