// Load environment variables FIRST
require('dotenv').config();

console.log('=== Strapi Starting ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_CLIENT:', process.env.DATABASE_CLIENT);
console.log('PORT:', process.env.PORT);

// Import Strapi
const strapi = require('@strapi/strapi');

// Start Strapi with the correct syntax
strapi.createStrapi({ distDir: './dist' }).start();
