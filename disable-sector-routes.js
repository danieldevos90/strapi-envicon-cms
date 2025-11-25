/**
 * Disable Sector Routes Temporarily
 * 
 * Since the sector content type is causing startup issues,
 * temporarily disable the custom routes to allow Strapi to start
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Temporarily disabling sector routes...');

const sectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');
const customSectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/custom-sector.js');

try {
  // Create backup of current routes
  const routesContent = fs.readFileSync(sectorRoutesPath, 'utf8');
  const backupPath = sectorRoutesPath + '.error-backup';
  fs.writeFileSync(backupPath, routesContent);
  console.log('💾 Backup created:', backupPath);
  
  // Create minimal routes file that won't crash
  const minimalRoutes = `'use strict';

/**
 * sector router - TEMPORARILY DISABLED
 * 
 * This file has been temporarily simplified to prevent startup errors.
 * The original file is backed up as sector.js.error-backup
 */

// Export empty routes to prevent createCoreRouter issues
module.exports = {
  routes: [
    // Core routes temporarily disabled due to content type loading issues
    // Custom populate route kept for functionality
    {
      method: 'POST',
      path: '/sectors/populate-all',
      handler: 'custom-sector.populateAll',
      config: {
        auth: false,
      },
    },
  ],
};
`;

  // Write minimal routes
  fs.writeFileSync(sectorRoutesPath, minimalRoutes);
  console.log('✅ Sector routes temporarily disabled');
  
  console.log('');
  console.log('🔄 Next steps:');
  console.log('1. npm run build');
  console.log('2. npm run restart');
  console.log('');
  console.log('⚠️  Note: Sector CRUD operations will be limited until routes are restored');
  console.log('📁 Original routes backed up to:', backupPath);
  
} catch (error) {
  console.error('❌ Error disabling sector routes:', error.message);
  process.exit(1);
}
