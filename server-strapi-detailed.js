console.log('=== Detailed Strapi Startup Test ===');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

// Set up error handlers
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Check environment
console.log('\nEnvironment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT);

// Check if dist exists
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const distExists = fs.existsSync(distPath);
console.log('\n✅ dist folder exists:', distExists);

if (!distExists) {
  console.error('❌ dist folder not found! Run: npm run build');
  process.exit(1);
}

// Check if .tmp exists
const tmpPath = path.join(__dirname, '.tmp');
if (!fs.existsSync(tmpPath)) {
  console.log('Creating .tmp directory...');
  fs.mkdirSync(tmpPath, { recursive: true });
}

// Try to load Strapi with detailed logging
console.log('\n=== Loading Strapi module ===');
try {
  const strapi = require('@strapi/strapi');
  console.log('✅ Strapi module loaded');
  
  console.log('\n=== Starting Strapi ===');
  
  // Start with error handling
  strapi()
    .start()
    .then(() => {
      console.log('✅ Strapi started successfully!');
    })
    .catch((error) => {
      console.error('❌ Strapi startup error:', error);
      console.error('Error stack:', error.stack);
      process.exit(1);
    });
    
  // Give it some time to start
  setTimeout(() => {
    console.log('Strapi is initializing...');
  }, 2000);
  
} catch (error) {
  console.error('❌ Failed to load Strapi:', error);
  console.error('Error stack:', error.stack);
  process.exit(1);
}




