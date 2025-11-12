/**
 * Emergency Fix for Homepage 500 Error
 * 
 * This script creates a minimal homepage schema that should work
 * and removes any problematic components.
 */

const fs = require('fs');
const path = require('path');

const HOMEPAGE_SCHEMA_PATH = path.join(__dirname, 'src/api/homepage/content-types/homepage/schema.json');

console.log('🚨 Emergency fix for homepage 500 error...');

try {
  // Create backup of current schema
  const backupPath = HOMEPAGE_SCHEMA_PATH + '.emergency-backup';
  if (fs.existsSync(HOMEPAGE_SCHEMA_PATH)) {
    const currentContent = fs.readFileSync(HOMEPAGE_SCHEMA_PATH, 'utf8');
    fs.writeFileSync(backupPath, currentContent);
    console.log('💾 Emergency backup created:', backupPath);
  }
  
  // Create minimal working schema with only basic components
  const minimalSchema = {
    "kind": "singleType",
    "collectionName": "homepages",
    "info": {
      "singularName": "homepage",
      "pluralName": "homepages",
      "displayName": "Homepage",
      "description": "Homepage content and sections"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {},
    "attributes": {
      "hero": {
        "type": "component",
        "repeatable": false,
        "component": "sections.hero"
      },
      "about": {
        "type": "component",
        "repeatable": false,
        "component": "sections.about"
      },
      "intro": {
        "type": "component",
        "repeatable": false,
        "component": "sections.intro"
      },
      "gallery": {
        "type": "component",
        "repeatable": false,
        "component": "sections.gallery"
      },
      "solutions": {
        "type": "component",
        "repeatable": false,
        "component": "sections.solutions-section"
      },
      "articles": {
        "type": "component",
        "repeatable": false,
        "component": "sections.articles-section"
      },
      "sectors": {
        "type": "component",
        "repeatable": false,
        "component": "sections.sectors-section"
      },
      "services": {
        "type": "component",
        "repeatable": false,
        "component": "sections.services-section"
      },
      "contact": {
        "type": "component",
        "repeatable": false,
        "component": "sections.contact"
      }
    }
  };
  
  // Write minimal schema (removed: process, benefits)
  fs.writeFileSync(HOMEPAGE_SCHEMA_PATH, JSON.stringify(minimalSchema, null, 2));
  console.log('✅ Minimal homepage schema created');
  console.log('📋 Fields included:', Object.keys(minimalSchema.attributes));
  console.log('🚫 Fields removed temporarily: process, benefits');
  
  console.log('');
  console.log('🔄 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Run: npm run restart');
  console.log('3. Check Strapi Admin - should work now');
  console.log('');
  console.log('📁 Backup location:', backupPath);
  
} catch (error) {
  console.error('❌ Error creating minimal schema:', error.message);
  process.exit(1);
}
