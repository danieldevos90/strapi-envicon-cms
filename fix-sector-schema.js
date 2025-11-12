/**
 * Fix Sector Schema Issue
 * 
 * The error "Cannot read properties of undefined (reading 'kind')" 
 * suggests the sector schema is malformed or missing required fields
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing sector schema issue...');

const sectorSchemaPath = path.join(__dirname, 'src/api/sector/content-types/sector/schema.json');

try {
  // Read current sector schema
  const schemaContent = fs.readFileSync(sectorSchemaPath, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  console.log('📋 Current sector schema structure:');
  console.log('  - kind:', schema.kind);
  console.log('  - collectionName:', schema.collectionName);
  console.log('  - info:', schema.info ? 'exists' : 'MISSING');
  console.log('  - attributes:', schema.attributes ? Object.keys(schema.attributes).length + ' fields' : 'MISSING');
  
  // Check if required fields are missing
  let needsFix = false;
  
  if (!schema.kind) {
    console.log('❌ Missing "kind" field');
    schema.kind = 'collectionType';
    needsFix = true;
  }
  
  if (!schema.collectionName) {
    console.log('❌ Missing "collectionName" field');
    schema.collectionName = 'sectors';
    needsFix = true;
  }
  
  if (!schema.info) {
    console.log('❌ Missing "info" object');
    schema.info = {
      singularName: 'sector',
      pluralName: 'sectors',
      displayName: 'Sector',
      description: 'Sector pages with content'
    };
    needsFix = true;
  }
  
  if (!schema.options) {
    console.log('❌ Missing "options" object');
    schema.options = {
      draftAndPublish: true
    };
    needsFix = true;
  }
  
  if (!schema.attributes) {
    console.log('❌ Missing "attributes" object');
    schema.attributes = {
      title: {
        type: 'string',
        required: true
      },
      slug: {
        type: 'uid',
        targetField: 'title',
        required: true
      },
      description: {
        type: 'text'
      }
    };
    needsFix = true;
  }
  
  if (needsFix) {
    // Create backup
    const backupPath = sectorSchemaPath + '.backup';
    fs.writeFileSync(backupPath, schemaContent);
    console.log('💾 Backup created:', backupPath);
    
    // Write fixed schema
    fs.writeFileSync(sectorSchemaPath, JSON.stringify(schema, null, 2));
    console.log('✅ Sector schema fixed');
    
    console.log('');
    console.log('🔄 Next steps:');
    console.log('1. npm run build');
    console.log('2. npm run restart');
  } else {
    console.log('✅ Sector schema appears to be valid');
    console.log('');
    console.log('💡 The error might be in the routes file or controller');
    console.log('🔄 Try: npm run build && npm run restart');
  }
  
} catch (error) {
  console.error('❌ Error reading sector schema:', error.message);
  
  console.log('');
  console.log('🔧 Creating minimal sector schema...');
  
  const minimalSchema = {
    "kind": "collectionType",
    "collectionName": "sectors",
    "info": {
      "singularName": "sector",
      "pluralName": "sectors",
      "displayName": "Sector",
      "description": "Sector pages"
    },
    "options": {
      "draftAndPublish": true
    },
    "pluginOptions": {},
    "attributes": {
      "title": {
        "type": "string",
        "required": true
      },
      "slug": {
        "type": "uid",
        "targetField": "title",
        "required": true
      },
      "description": {
        "type": "text"
      },
      "order": {
        "type": "integer",
        "default": 0
      }
    }
  };
  
  try {
    fs.writeFileSync(sectorSchemaPath, JSON.stringify(minimalSchema, null, 2));
    console.log('✅ Created minimal sector schema');
    console.log('🔄 Run: npm run build && npm run restart');
  } catch (writeError) {
    console.error('❌ Failed to create sector schema:', writeError.message);
  }
}
