/**
 * Fix Sector Routes - Final Solution
 * 
 * Remove the custom populateAll route that's causing the error
 * and use only the standard Strapi routes
 */

const fs = require('fs');
const path = require('path');

console.log('════════════════════════════════════════════════════════');
console.log('🔧 FIXING SECTOR ROUTES - FINAL FIX');
console.log('════════════════════════════════════════════════════════');
console.log('');

const sectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');

console.log('📍 Step 1/3: Checking current routes file...');
console.log('   Path:', sectorRoutesPath);

try {
  // Create backup
  if (fs.existsSync(sectorRoutesPath)) {
    console.log('   ✅ File exists');
    console.log('');
    console.log('📍 Step 2/3: Creating backup...');
    
    const currentContent = fs.readFileSync(sectorRoutesPath, 'utf8');
    const backupPath = sectorRoutesPath + '.final-backup';
    fs.writeFileSync(backupPath, currentContent);
    console.log('   ✅ Backup saved to:', backupPath);
  } else {
    console.log('   ⚠️  File does not exist, will create new one');
  }
  
  console.log('');
  console.log('📍 Step 3/3: Writing new routes file...');
  
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
  console.log('   ✅ New routes file written');
  
  console.log('');
  console.log('════════════════════════════════════════════════════════');
  console.log('✅ SECTOR ROUTES FIX COMPLETE');
  console.log('════════════════════════════════════════════════════════');
  console.log('');
  console.log('📋 What was changed:');
  console.log('   ✅ Created standard sector routes');
  console.log('   🗑️  Removed custom populateAll route (was causing error)');
  console.log('   💾 Original file backed up');
  console.log('');
  console.log('🔄 Next: Build and restart will run automatically...');
  console.log('');
  console.log('⏱️  This may take 30-40 seconds...');
  console.log('');
  
} catch (error) {
  console.error('');
  console.error('════════════════════════════════════════════════════════');
  console.error('❌ ERROR FIXING SECTOR ROUTES');
  console.error('════════════════════════════════════════════════════════');
  console.error('');
  console.error('Error:', error.message);
  console.error('');
  process.exit(1);
}
