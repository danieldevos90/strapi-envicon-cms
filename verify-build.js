/**
 * Verify Build Script for Strapi CMS
 * 
 * This script verifies that all necessary files are present in the dist folder
 * for Strapi to run properly in production.
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Strapi build...\n');

let errors = 0;
let warnings = 0;

// Check 1: Verify dist folder exists
console.log('1️⃣  Checking dist folder...');
if (!fs.existsSync('./dist')) {
  console.error('❌ ERROR: dist folder does not exist. Run npm run build first.');
  errors++;
} else {
  console.log('✅ dist folder exists\n');
}

// Check 2: Verify config files are compiled
console.log('2️⃣  Checking compiled config files...');
const configFiles = ['admin.js', 'api.js', 'database.js', 'middlewares.js', 'plugins.js', 'server.js'];
configFiles.forEach(file => {
  const filePath = path.join('./dist/config', file);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ ERROR: ${filePath} is missing`);
    errors++;
  } else {
    console.log(`✅ ${file} compiled`);
  }
});
console.log('');

// Check 3: Verify src/index.js is compiled
console.log('3️⃣  Checking compiled index file...');
if (!fs.existsSync('./dist/src/index.js')) {
  console.error('❌ ERROR: dist/src/index.js is missing');
  errors++;
} else {
  console.log('✅ index.js compiled\n');
}

// Check 4: Verify API content types
console.log('4️⃣  Checking API content types...');
const apiDir = './src/api';
if (fs.existsSync(apiDir)) {
  const contentTypes = fs.readdirSync(apiDir);
  
  contentTypes.forEach(contentType => {
    const srcPath = path.join(apiDir, contentType);
    const distPath = path.join('./dist/src/api', contentType);
    
    if (!fs.lstatSync(srcPath).isDirectory()) return;
    
    console.log(`\n  📦 ${contentType}:`);
    
    // Check schema.json
    const schemaPath = path.join(distPath, 'content-types', contentType, 'schema.json');
    if (!fs.existsSync(schemaPath)) {
      console.error(`    ❌ ERROR: schema.json missing`);
      errors++;
    } else {
      console.log(`    ✅ schema.json`);
    }
    
    // Check controllers, routes, services
    const requiredFiles = ['controllers', 'routes', 'services'];
    requiredFiles.forEach(folder => {
      const srcFolder = path.join(srcPath, folder);
      const distFolder = path.join(distPath, folder);
      
      if (fs.existsSync(srcFolder)) {
        const files = fs.readdirSync(srcFolder);
        const jsFiles = files.filter(f => f.endsWith('.js'));
        
        if (jsFiles.length > 0) {
          if (!fs.existsSync(distFolder)) {
            console.error(`    ❌ ERROR: ${folder}/ folder missing in dist`);
            errors++;
          } else {
            const distFiles = fs.readdirSync(distFolder);
            const missingFiles = jsFiles.filter(f => !distFiles.includes(f));
            
            if (missingFiles.length > 0) {
              console.error(`    ❌ ERROR: ${folder}/ missing files: ${missingFiles.join(', ')}`);
              errors++;
            } else {
              console.log(`    ✅ ${folder}/ (${jsFiles.length} file${jsFiles.length > 1 ? 's' : ''})`);
            }
          }
        }
      }
    });
  });
}
console.log('');

// Check 5: Verify component schemas
console.log('5️⃣  Checking component schemas...');
const componentsDir = './src/components';
if (fs.existsSync(componentsDir)) {
  const componentCount = countJsonFiles(componentsDir);
  const distComponentCount = countJsonFiles('./dist/src/components');
  
  if (componentCount !== distComponentCount) {
    console.error(`❌ ERROR: Component count mismatch (src: ${componentCount}, dist: ${distComponentCount})`);
    errors++;
  } else {
    console.log(`✅ ${componentCount} component schemas copied\n`);
  }
}

// Check 6: Verify .strapi folder (admin build)
console.log('6️⃣  Checking admin build...');
if (!fs.existsSync('./.strapi')) {
  console.warn('⚠️  WARNING: .strapi folder missing (admin panel may not work)');
  warnings++;
} else {
  console.log('✅ Admin build exists\n');
}

// Final summary
console.log('═'.repeat(50));
console.log('📊 Verification Summary:');
console.log(`  ✅ Passed checks: ${warnings === 0 && errors === 0 ? 'All' : 'Some'}`);
console.log(`  ❌ Errors: ${errors}`);
console.log(`  ⚠️  Warnings: ${warnings}`);
console.log('═'.repeat(50));

if (errors > 0) {
  console.error('\n❌ Build verification FAILED. Please run npm run build to fix issues.');
  process.exit(1);
} else if (warnings > 0) {
  console.warn('\n⚠️  Build verification completed with warnings.');
  process.exit(0);
} else {
  console.log('\n✅ Build verification PASSED! Ready for deployment.');
  process.exit(0);
}

/**
 * Count JSON files in a directory recursively
 */
function countJsonFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countJsonFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      count++;
    }
  }
  
  return count;
}





