/**
 * Reset Homepage Data
 * 
 * Deletes the current homepage data to resolve schema conflicts.
 * The old homepage data might have a structure that conflicts with the new schema.
 */

const fs = require('fs');
const path = require('path');

console.log('🗑️  Resetting homepage data to fix schema conflicts...');

// We'll create a SQL script to delete homepage data
const sqlScript = `-- Reset Homepage Data
-- This removes the existing homepage data that might conflict with the new schema

USE enviconnl_strapi;

-- Delete homepage data (single type)
DELETE FROM homepages WHERE id IS NOT NULL;

-- Reset auto increment if needed
ALTER TABLE homepages AUTO_INCREMENT = 1;

-- Show result
SELECT COUNT(*) as remaining_homepages FROM homepages;
`;

const sqlPath = path.join(__dirname, 'reset-homepage.sql');
fs.writeFileSync(sqlPath, sqlScript);

console.log('✅ Created SQL script:', sqlPath);
console.log('');
console.log('📋 To reset homepage data, run this SQL:');
console.log('');
console.log('mysql -u [username] -p enviconnl_strapi < reset-homepage.sql');
console.log('');
console.log('OR manually in MySQL:');
console.log('');
console.log('USE enviconnl_strapi;');
console.log('DELETE FROM homepages WHERE id IS NOT NULL;');
console.log('');
console.log('🔄 After deleting homepage data:');
console.log('1. npm run build');
console.log('2. npm run restart');
console.log('3. Go to Strapi Admin → Homepage');
console.log('4. Create new homepage with correct schema');
console.log('');
console.log('💡 This should resolve the schema conflict causing the 500 error');

// Also create a Node.js version that connects to MySQL
const mysqlResetScript = `/**
 * MySQL Homepage Reset Script
 * Run this if you have MySQL credentials
 */

const mysql = require('mysql2/promise');

async function resetHomepage() {
  try {
    // You'll need to update these credentials
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USERNAME || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'enviconnl_strapi'
    });

    console.log('🔗 Connected to MySQL database');
    
    // Delete homepage data
    const [result] = await connection.execute('DELETE FROM homepages WHERE id IS NOT NULL');
    console.log('✅ Deleted homepage data:', result.affectedRows, 'rows');
    
    // Check remaining data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM homepages');
    console.log('📊 Remaining homepage records:', rows[0].count);
    
    await connection.end();
    console.log('✅ Homepage data reset complete');
    
  } catch (error) {
    console.error('❌ Error resetting homepage data:', error.message);
    console.log('');
    console.log('💡 Try the manual SQL approach instead:');
    console.log('   mysql -u [username] -p enviconnl_strapi < reset-homepage.sql');
  }
}

resetHomepage();
`;

const mysqlScriptPath = path.join(__dirname, 'reset-homepage-mysql.js');
fs.writeFileSync(mysqlScriptPath, mysqlResetScript);

console.log('📝 Also created MySQL script:', mysqlScriptPath);
console.log('   (if you have database credentials configured)');
