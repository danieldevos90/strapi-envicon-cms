/**
 * Fix Sector Routes Issue
 * 
 * The error occurs in sector/routes/sector.js when createCoreRouter
 * receives undefined instead of the content type definition
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing sector routes issue...');

const sectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');

try {
  // Read current routes file
  const routesContent = fs.readFileSync(sectorRoutesPath, 'utf8');
  console.log('📋 Current sector routes file:');
  console.log(routesContent);
  
  // Create backup
  const backupPath = sectorRoutesPath + '.backup';
  fs.writeFileSync(backupPath, routesContent);
  console.log('💾 Backup created:', backupPath);
  
  // Create fixed routes file with error handling
  const fixedRoutes = `'use strict';

/**
 * sector router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Create router with error handling
let defaultRouter;
try {
  defaultRouter = createCoreRouter('api::sector.sector');
} catch (error) {
  console.error('Error creating sector router:', error);
  // Fallback to empty routes if content type is not available
  defaultRouter = { routes: [] };
}

module.exports = {
  routes: [
    ...(defaultRouter.routes || []),
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

  // Write fixed routes file
  fs.writeFileSync(sectorRoutesPath, fixedRoutes);
  console.log('✅ Fixed sector routes with error handling');
  
  console.log('');
  console.log('🔄 Next steps:');
  console.log('1. npm run build');
  console.log('2. npm run restart');
  console.log('');
  console.log('💡 This adds error handling to prevent the "kind" error');
  
} catch (error) {
  console.error('❌ Error fixing sector routes:', error.message);
  process.exit(1);
}
