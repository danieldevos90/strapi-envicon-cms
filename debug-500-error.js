/**
 * Debug 500 Error - Advanced Diagnostics
 * 
 * Since all components are valid, check for other potential causes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Advanced 500 error diagnostics...');

// Check 1: Verify dist folder has compiled components
console.log('\n📁 Checking compiled components in dist folder...');
const distComponentsPath = path.join(__dirname, 'dist/src/components');

if (fs.existsSync(distComponentsPath)) {
  console.log('✅ dist/src/components exists');
  
  const sectionsDistPath = path.join(distComponentsPath, 'sections');
  const uiDistPath = path.join(distComponentsPath, 'ui');
  
  if (fs.existsSync(sectionsDistPath)) {
    const sectionFiles = fs.readdirSync(sectionsDistPath);
    console.log('📂 Compiled section components:', sectionFiles.length);
    sectionFiles.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('❌ dist/src/components/sections missing');
  }
  
  if (fs.existsSync(uiDistPath)) {
    const uiFiles = fs.readdirSync(uiDistPath);
    console.log('📂 Compiled UI components:', uiFiles.length);
    uiFiles.forEach(file => console.log(`  - ${file}`));
  } else {
    console.log('❌ dist/src/components/ui missing');
  }
} else {
  console.log('❌ dist/src/components does not exist - build may have failed');
}

// Check 2: Look for process-section component (it's referenced but might be missing)
console.log('\n🔍 Checking for process-section component...');
const processComponentPath = path.join(__dirname, 'src/components/sections/process-section.json');

if (fs.existsSync(processComponentPath)) {
  try {
    const processContent = fs.readFileSync(processComponentPath, 'utf8');
    const processComponent = JSON.parse(processContent);
    console.log('✅ process-section.json exists and is valid');
    console.log('📋 Process component fields:', Object.keys(processComponent.attributes || {}));
  } catch (error) {
    console.log('❌ process-section.json is invalid:', error.message);
  }
} else {
  console.log('❌ process-section.json is MISSING - this could cause 500 error');
}

// Check 3: Database connection and existing data
console.log('\n🔍 Checking for potential data conflicts...');
console.log('💡 The 500 error might be caused by:');
console.log('  1. Existing homepage data with old structure');
console.log('  2. Database schema mismatch');
console.log('  3. Component registration timing issue');

// Check 4: Suggest fixes
console.log('\n🔧 Suggested fixes (try in order):');
console.log('');
console.log('Option 1 - Clear cache and rebuild:');
console.log('  rm -rf .cache dist');
console.log('  npm run build');
console.log('  npm run restart');
console.log('');
console.log('Option 2 - Use minimal schema:');
console.log('  npm run emergency:homepage');
console.log('');
console.log('Option 3 - Check if process-section exists:');
if (!fs.existsSync(processComponentPath)) {
  console.log('  ❌ CREATE process-section.json component first');
} else {
  console.log('  ✅ process-section.json exists');
}

// Check 5: Create process-section if missing
if (!fs.existsSync(processComponentPath)) {
  console.log('\n🔧 Creating missing process-section.json...');
  
  const processComponent = {
    "collectionName": "components_sections_process_sections",
    "info": {
      "displayName": "Process Section",
      "description": "Process section titles"
    },
    "options": {},
    "attributes": {
      "subtitle": {
        "type": "string",
        "required": true,
        "default": "PROCES"
      },
      "title": {
        "type": "string",
        "required": true,
        "default": "Hoe werken wij?"
      },
      "description": {
        "type": "text"
      }
    }
  };
  
  try {
    fs.writeFileSync(processComponentPath, JSON.stringify(processComponent, null, 2));
    console.log('✅ Created process-section.json');
    console.log('🔄 Now run: npm run build && npm run restart');
  } catch (error) {
    console.log('❌ Failed to create process-section.json:', error.message);
  }
}

console.log('\n🎯 Most likely fix: npm run build && npm run restart');
console.log('   (All components exist, just need to rebuild)');
