console.log('=== Comprehensive Strapi Test ===\n');

// Load environment variables
require('dotenv').config();

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

// Test 1: Node.js version
test('Node.js version (should be 18.x or 20.x)', () => {
  const version = process.version;
  console.log(`   Version: ${version}`);
  const major = parseInt(version.split('.')[0].substring(1));
  return major === 18 || major === 20;
});

// Test 2: Environment variables
console.log('\n📋 Environment Variables:');
test('NODE_ENV is set', () => {
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  return process.env.NODE_ENV === 'production';
});

test('DATABASE_CLIENT is set', () => {
  console.log(`   DATABASE_CLIENT: ${process.env.DATABASE_CLIENT}`);
  return process.env.DATABASE_CLIENT === 'mysql';
});

test('Database credentials are set', () => {
  return process.env.DATABASE_HOST && 
         process.env.DATABASE_NAME && 
         process.env.DATABASE_USERNAME && 
         process.env.DATABASE_PASSWORD;
});

// Test 3: Required directories
console.log('\n📁 Directory Structure:');
test('dist folder exists', () => {
  return fs.existsSync(path.join(__dirname, 'dist'));
});

test('node_modules exists', () => {
  return fs.existsSync(path.join(__dirname, 'node_modules'));
});

test('.tmp directory exists or can be created', () => {
  const tmpPath = path.join(__dirname, '.tmp');
  if (!fs.existsSync(tmpPath)) {
    fs.mkdirSync(tmpPath, { recursive: true });
  }
  return fs.existsSync(tmpPath);
});

// Test 4: Required packages
console.log('\n📦 Required Packages:');
test('@strapi/strapi is installed', () => {
  require.resolve('@strapi/strapi');
  return true;
});

test('mysql2 is installed', () => {
  require.resolve('mysql2');
  return true;
});

test('dotenv is installed', () => {
  require.resolve('dotenv');
  return true;
});

// Test 5: MySQL connection
console.log('\n🔌 MySQL Connection:');
test('MySQL connection works', async () => {
  try {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT || 3306,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    });
    await connection.execute('SELECT 1');
    await connection.end();
    return true;
  } catch (error) {
    console.log(`   Error: ${error.message}`);
    return false;
  }
});

// Test 6: Strapi can be loaded
console.log('\n🚀 Strapi Module:');
test('Strapi module can be loaded', () => {
  const strapi = require('@strapi/strapi');
  return typeof strapi.createStrapi === 'function';
});

// Summary
setTimeout(() => {
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('✅ All tests passed! Strapi should work.');
    console.log('\nNext step: Use server.js as startup file and restart app.');
  } else {
    console.log('❌ Some tests failed. Fix the issues above.');
  }
  console.log('='.repeat(50));
  
  process.exit(failed > 0 ? 1 : 0);
}, 2000);




