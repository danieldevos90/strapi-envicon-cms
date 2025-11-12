/**
 * Fix Sector Routes - Final Solution
 * 
 * Remove the custom populateAll route that's causing the error
 * and use only the standard Strapi routes
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Creating working sector routes (final fix)...');

const sectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');

try {
  // Create backup
  if (fs.existsSync(sectorRoutesPath)) {
    const currentContent = fs.readFileSync(sectorRoutesPath, 'utf8');
    const backupPath = sectorRoutesPath + '.final-backup';
    fs.writeFileSync(backupPath, currentContent);
    console.log('💾 Backup created:', backupPath);
  }
  
  // Create simple working routes without custom handlers
  const workingRoutes = `'use strict';

/**
 * sector router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sector.sector');
`;

  // Write working routes
  fs.writeFileSync(sectorRoutesPath, workingRoutes);
  console.log('✅ Created standard sector routes');
  console.log('🗑️  Removed custom populateAll route (was causing error)');
  
  console.log('');
  console.log('🔄 Next steps:');
  console.log('1. npm run build');
  console.log('2. npm run restart');
  console.log('');
  console.log('💡 This uses standard Strapi routes only');
  console.log('⚠️  The custom /sectors/populate-all endpoint will be unavailable');
  console.log('   (but standard CRUD operations will work)');
  
} catch (error) {
  console.error('❌ Error fixing sector routes:', error.message);
  process.exit(1);
}
