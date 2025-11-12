/**
 * Quick Fix for Missing Dist Files
 * 
 * This script quickly copies missing API files to the dist folder
 * without requiring a full rebuild. Use this as a temporary fix on Plesk.
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Quick fix: Copying missing API files to dist...\n');

// Ensure dist/src/api exists
const distApiPath = './dist/src/api';
if (!fs.existsSync(distApiPath)) {
  fs.mkdirSync(distApiPath, { recursive: true });
  console.log('✅ Created dist/src/api directory\n');
}

// Copy all API files
const srcApiPath = './src/api';
if (!fs.existsSync(srcApiPath)) {
  console.error('❌ ERROR: src/api folder not found!');
  process.exit(1);
}

let copiedFiles = 0;
let errors = 0;

const contentTypes = fs.readdirSync(srcApiPath);

contentTypes.forEach(contentType => {
  const srcPath = path.join(srcApiPath, contentType);
  
  if (!fs.lstatSync(srcPath).isDirectory()) return;
  
  console.log(`📦 Processing ${contentType}...`);
  
  const distPath = path.join(distApiPath, contentType);
  
  // Copy controllers
  const srcControllers = path.join(srcPath, 'controllers');
  if (fs.existsSync(srcControllers)) {
    const distControllers = path.join(distPath, 'controllers');
    if (!fs.existsSync(distControllers)) {
      fs.mkdirSync(distControllers, { recursive: true });
    }
    
    const files = fs.readdirSync(srcControllers);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(srcControllers, file),
          path.join(distControllers, file)
        );
        console.log(`  ✓ Copied controllers/${file}`);
        copiedFiles++;
      }
    });
  }
  
  // Copy routes
  const srcRoutes = path.join(srcPath, 'routes');
  if (fs.existsSync(srcRoutes)) {
    const distRoutes = path.join(distPath, 'routes');
    if (!fs.existsSync(distRoutes)) {
      fs.mkdirSync(distRoutes, { recursive: true });
    }
    
    const files = fs.readdirSync(srcRoutes);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(srcRoutes, file),
          path.join(distRoutes, file)
        );
        console.log(`  ✓ Copied routes/${file}`);
        copiedFiles++;
      }
    });
  }
  
  // Copy services
  const srcServices = path.join(srcPath, 'services');
  if (fs.existsSync(srcServices)) {
    const distServices = path.join(distPath, 'services');
    if (!fs.existsSync(distServices)) {
      fs.mkdirSync(distServices, { recursive: true });
    }
    
    const files = fs.readdirSync(srcServices);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        fs.copyFileSync(
          path.join(srcServices, file),
          path.join(distServices, file)
        );
        console.log(`  ✓ Copied services/${file}`);
        copiedFiles++;
      }
    });
  }
  
  // Verify schema.json exists
  const schemaPath = path.join(distPath, 'content-types', contentType, 'schema.json');
  if (!fs.existsSync(schemaPath)) {
    const srcSchemaPath = path.join(srcPath, 'content-types', contentType, 'schema.json');
    if (fs.existsSync(srcSchemaPath)) {
      const distSchemaDir = path.dirname(schemaPath);
      if (!fs.existsSync(distSchemaDir)) {
        fs.mkdirSync(distSchemaDir, { recursive: true });
      }
      fs.copyFileSync(srcSchemaPath, schemaPath);
      console.log(`  ✓ Copied schema.json`);
      copiedFiles++;
    } else {
      console.error(`  ❌ WARNING: schema.json not found for ${contentType}`);
      errors++;
    }
  }
  
  console.log('');
});

console.log('═'.repeat(50));
console.log(`📊 Quick Fix Summary:`);
console.log(`  ✅ Files copied: ${copiedFiles}`);
console.log(`  ❌ Warnings: ${errors}`);
console.log('═'.repeat(50));

if (copiedFiles > 0) {
  console.log('\n✅ Quick fix applied successfully!');
  console.log('ℹ️  Next steps:');
  console.log('  1. Restart Strapi: npm run restart');
  console.log('  2. Verify build: npm run verify');
  console.log('  3. Check admin panel for content types\n');
} else {
  console.log('\n⚠️  No files were copied. The dist folder may already be up to date.');
  console.log('ℹ️  If you still have issues, run: npm run build\n');
}





