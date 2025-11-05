const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '3306'),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD
};

console.log('Database config:', {
  ...dbConfig,
  password: '***HIDDEN***'
});

async function migrateData() {
  let connection;
  
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to database');

    // Read the existing content from the database
    console.log('\n📊 Reading existing content from database...');
    const [contentRows] = await connection.execute('SELECT section, data FROM content');
    console.log(`✅ Found ${contentRows.length} content sections`);

    // Read articles from database
    console.log('\n📰 Reading existing articles from database...');
    const [articleRows] = await connection.execute(`
      SELECT slug, title, excerpt, author, published_at, featured_image, category, content, status 
      FROM articles
    `);
    console.log(`✅ Found ${articleRows.length} articles`);

    // Now we need to insert this data into Strapi tables
    // Strapi creates its own table structure, so we'll need to map our data

    console.log('\n🔄 Migration Summary:');
    console.log('-----------------------------------');
    console.log(`Content Sections: ${contentRows.length}`);
    console.log(`Articles: ${articleRows.length}`);
    console.log('-----------------------------------');

    console.log('\n📝 Content sections to migrate:');
    contentRows.forEach(row => {
      const data = JSON.parse(row.data);
      console.log(`  - ${row.section}: ${Object.keys(data).length} fields`);
    });

    console.log('\n📝 Articles to migrate:');
    articleRows.forEach(row => {
      console.log(`  - ${row.title} (${row.slug})`);
    });

    console.log('\n⚠️  IMPORTANT:');
    console.log('Strapi uses its own database schema.');
    console.log('You need to:');
    console.log('1. Start Strapi: npm run develop');
    console.log('2. Create an admin user at http://localhost:1337/admin');
    console.log('3. The content types will be automatically created');
    console.log('4. Use the Strapi admin panel to import data, or');
    console.log('5. Use the Strapi API to programmatically import data');

    console.log('\n✅ Data migration check complete!');
    console.log('\nNext steps:');
    console.log('1. cd strapi-cms');
    console.log('2. npm run build');
    console.log('3. npm run develop');
    console.log('4. Create admin user at http://localhost:1337/admin');
    console.log('5. Run import-to-strapi.js to import the data');

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Database connection closed');
    }
  }
}

// Check if we're in the right directory
const currentDir = process.cwd();
if (!currentDir.endsWith('strapi-cms')) {
  console.error('❌ Error: Please run this script from the strapi-cms directory');
  console.log('cd strapi-cms && node migrate-data.js');
  process.exit(1);
}

// Run migration
migrateData();

