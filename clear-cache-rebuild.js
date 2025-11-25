/**
 * Clear Cache and Rebuild Script
 * 
 * Clears Strapi cache and dist folder, then provides rebuild instructions
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing Strapi cache and build files...');

// Directories to clear
const dirsToRemove = [
  '.cache',
  'dist',
  '.tmp'
];

dirsToRemove.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Removed ${dir}`);
    } catch (error) {
      console.log(`⚠️  Could not remove ${dir}:`, error.message);
    }
  } else {
    console.log(`ℹ️  ${dir} does not exist`);
  }
});

console.log('');
console.log('🔧 Cache cleared! Next steps:');
console.log('1. npm run build    (rebuild everything from scratch)');
console.log('2. npm run restart  (restart with fresh build)');
console.log('');
console.log('💡 This should fix component registration timing issues');
console.log('   and resolve conflicts with old cached data.');
