console.log('=== MySQL Connection Test ===');

const mysql = require('mysql2/promise');

// Load environment variables
require('dotenv').config();

console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  DB_CLIENT: process.env.DATABASE_CLIENT,
  DB_HOST: process.env.DATABASE_HOST,
  DB_NAME: process.env.DATABASE_NAME,
  DB_USER: process.env.DATABASE_USERNAME,
  DB_PORT: process.env.DATABASE_PORT
});

async function testConnection() {
  try {
    console.log('\nTesting MySQL connection...');
    
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_PORT || 3306,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    });
    
    console.log('✅ MySQL connection successful!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query test successful:', rows);
    
    await connection.end();
    
    // Now try to start Strapi
    console.log('\n=== Starting Strapi ===');
    const strapi = require('@strapi/strapi');
    strapi().start();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('\n⚠️  Missing module. Run: npm install mysql2 dotenv');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n⚠️  MySQL connection refused. Check if MySQL is running.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n⚠️  Access denied. Check username/password.');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\n⚠️  Database does not exist.');
    }
  }
}

testConnection();
