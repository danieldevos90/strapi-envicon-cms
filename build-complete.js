/**
 * Complete Build Script for Strapi CMS
 * 
 * This script ensures all necessary files are compiled/copied to the dist folder:
 * 1. Compiles TypeScript files
 * 2. Copies JavaScript files from src/api to dist/src/api
 * 3. Copies JSON schema files
 * 4. Copies component schemas
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting complete Strapi build...\n');

// Step 1: Clean dist folder
console.log('📁 Cleaning dist folder...');
if (fs.existsSync('./dist')) {
  fs.rmSync('./dist', { recursive: true, force: true });
  console.log('✅ Dist folder cleaned\n');
}

// Step 2: Run TypeScript compilation
console.log('📦 Compiling TypeScript files...');
try {
  execSync('npx tsc', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation complete\n');
} catch (error) {
  console.error('❌ TypeScript compilation failed:', error.message);
  process.exit(1);
}

// Step 3: Copy JavaScript files from src/api to dist/src/api
console.log('📋 Copying API JavaScript files...');
copyDirectory('./src/api', './dist/src/api', ['.js', '.json']);
console.log('✅ API files copied\n');

// Step 4: Copy component schemas
console.log('📋 Copying component schemas...');
copyDirectory('./src/components', './dist/src/components', ['.json']);
console.log('✅ Component schemas copied\n');

// Step 5: Run Strapi build
console.log('🏗️  Running Strapi build...');
try {
  execSync('strapi build', { stdio: 'inherit' });
  console.log('✅ Strapi build complete\n');
} catch (error) {
  console.error('❌ Strapi build failed:', error.message);
  process.exit(1);
}

console.log('🎉 Complete build finished successfully!\n');

/**
 * Recursively copy directory contents
 */
function copyDirectory(src, dest, extensions = null) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Source directory does not exist: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath, extensions);
    } else if (entry.isFile()) {
      // Check if we should copy this file
      if (extensions === null || extensions.some(ext => entry.name.endsWith(ext))) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`  ✓ Copied: ${srcPath} → ${destPath}`);
      }
    }
  }
}

