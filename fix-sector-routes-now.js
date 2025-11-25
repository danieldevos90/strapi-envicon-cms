/**
 * Quick fix script to ensure sector routes are correct
 * Run this before rebuilding
 */

const fs = require('fs');
const path = require('path');

const sectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');

console.log('🔧 Fixing sector routes...');

const correctContent = `'use strict';

/**
 * sector router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::sector.sector');
`;

try {
  // Backup original
  if (fs.existsSync(sectorRoutesPath)) {
    const backupPath = sectorRoutesPath + '.backup.' + Date.now();
    fs.copyFileSync(sectorRoutesPath, backupPath);
    console.log(`✅ Backed up to: ${backupPath}`);
  }

  // Write correct content
  fs.writeFileSync(sectorRoutesPath, correctContent, 'utf8');
  console.log('✅ Sector routes fixed!');
  console.log('');
  console.log('Next: npm run build');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

