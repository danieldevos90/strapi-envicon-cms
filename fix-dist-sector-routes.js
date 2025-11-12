/**
 * Fix Dist Sector Routes Directly
 * 
 * Directly modifies the compiled dist file to remove the problematic route
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing dist/src/api/sector/routes/sector.js directly...');

const distRoutesPath = path.join(__dirname, 'dist/src/api/sector/routes/sector.js');
const srcRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');

// First fix the source file
console.log('📍 Step 1: Fixing source file...');
const simpleRoutes = `'use strict';

/**
 * sector router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sector.sector');
`;

fs.writeFileSync(srcRoutesPath, simpleRoutes);
console.log('✅ Source file fixed');

// Then fix the dist file if it exists
if (fs.existsSync(distRoutesPath)) {
  console.log('📍 Step 2: Fixing dist file...');
  fs.writeFileSync(distRoutesPath, simpleRoutes);
  console.log('✅ Dist file fixed');
} else {
  console.log('⚠️  Dist file does not exist yet');
}

console.log('');
console.log('✅ Both source and dist files fixed');
console.log('🔄 Now run: npm run restart');
