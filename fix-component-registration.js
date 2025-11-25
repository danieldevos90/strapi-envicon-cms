/**
 * Fix Component Registration Issues
 * 
 * This script ensures all components are properly structured and registered
 * Based on Strapi v5 documentation requirements
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing component registration issues...');

// Check and fix component files
const componentsDir = path.join(__dirname, 'src/components');
const sectionsDir = path.join(componentsDir, 'sections');
const uiDir = path.join(componentsDir, 'ui');

function validateAndFixComponent(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const component = JSON.parse(content);
    
    // Ensure required fields exist
    if (!component.collectionName) {
      console.log(`❌ Missing collectionName in ${componentName}`);
      return false;
    }
    
    if (!component.info || !component.info.displayName) {
      console.log(`❌ Missing info.displayName in ${componentName}`);
      return false;
    }
    
    if (!component.attributes) {
      console.log(`❌ Missing attributes in ${componentName}`);
      return false;
    }
    
    console.log(`✅ ${componentName} is valid`);
    return true;
  } catch (error) {
    console.log(`❌ Invalid JSON in ${componentName}:`, error.message);
    return false;
  }
}

// Check all section components
const sectionComponents = [
  'hero.json',
  'about.json', 
  'intro.json',
  'gallery.json',
  'solutions-section.json',
  'articles-section.json',
  'sectors-section.json',
  'services-section.json',
  'contact.json',
  'benefits-section.json'
];

console.log('🔍 Checking section components...');
let allValid = true;

sectionComponents.forEach(filename => {
  const filePath = path.join(sectionsDir, filename);
  if (fs.existsSync(filePath)) {
    const isValid = validateAndFixComponent(filePath, `sections/${filename}`);
    if (!isValid) allValid = false;
  } else {
    console.log(`❌ Missing component file: sections/${filename}`);
    allValid = false;
  }
});

// Check UI components
const uiComponents = [
  'feature.json',
  'contact-method.json'
];

console.log('🔍 Checking UI components...');

uiComponents.forEach(filename => {
  const filePath = path.join(uiDir, filename);
  if (fs.existsSync(filePath)) {
    const isValid = validateAndFixComponent(filePath, `ui/${filename}`);
    if (!isValid) allValid = false;
  } else {
    console.log(`❌ Missing component file: ui/${filename}`);
    allValid = false;
  }
});

// Check homepage schema
const homepageSchemaPath = path.join(__dirname, 'src/api/homepage/content-types/homepage/schema.json');
console.log('🔍 Checking homepage schema...');

try {
  const schemaContent = fs.readFileSync(homepageSchemaPath, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  console.log('📋 Homepage components referenced:');
  Object.entries(schema.attributes).forEach(([key, value]) => {
    if (value.type === 'component') {
      console.log(`  - ${key}: ${value.component}`);
    }
  });
  
  // Check if all referenced components exist
  const referencedComponents = Object.values(schema.attributes)
    .filter(attr => attr.type === 'component')
    .map(attr => attr.component);
  
  const missingComponents = [];
  referencedComponents.forEach(componentRef => {
    const [namespace, componentName] = componentRef.split('.');
    const componentPath = path.join(componentsDir, namespace, `${componentName}.json`);
    
    if (!fs.existsSync(componentPath)) {
      missingComponents.push(componentRef);
      console.log(`❌ Missing component: ${componentRef} (${componentPath})`);
    } else {
      console.log(`✅ Found component: ${componentRef}`);
    }
  });
  
  if (missingComponents.length > 0) {
    console.log('');
    console.log('🚨 FOUND MISSING COMPONENTS - This is likely causing the 500 error');
    console.log('Missing components:', missingComponents);
    allValid = false;
  }
  
} catch (error) {
  console.log('❌ Invalid homepage schema:', error.message);
  allValid = false;
}

console.log('');
if (allValid) {
  console.log('✅ All components and schema are valid');
  console.log('🔄 If 500 error persists, try:');
  console.log('1. npm run build');
  console.log('2. npm run restart');
  console.log('3. Clear browser cache');
} else {
  console.log('❌ Found issues that need to be fixed');
  console.log('🔧 Run npm run emergency:homepage to use minimal schema');
}

console.log('');
