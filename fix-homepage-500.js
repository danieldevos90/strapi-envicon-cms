/**
 * Fix Homepage 500 Error
 * 
 * This script temporarily removes the benefits field from homepage schema
 * to fix the 500 error until the component is properly registered.
 */

const fs = require('fs');
const path = require('path');

const HOMEPAGE_SCHEMA_PATH = path.join(__dirname, 'src/api/homepage/content-types/homepage/schema.json');

console.log('🔧 Fixing homepage 500 error...');

try {
  // Read current schema
  const schemaContent = fs.readFileSync(HOMEPAGE_SCHEMA_PATH, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  console.log('📋 Current homepage fields:', Object.keys(schema.attributes));
  
  // Check if benefits field exists
  if (schema.attributes.benefits) {
    console.log('⚠️  Found benefits field causing 500 error');
    
    // Create backup
    const backupPath = HOMEPAGE_SCHEMA_PATH + '.backup';
    fs.writeFileSync(backupPath, schemaContent);
    console.log('💾 Backup created:', backupPath);
    
    // Remove benefits field temporarily
    delete schema.attributes.benefits;
    
    // Write updated schema
    fs.writeFileSync(HOMEPAGE_SCHEMA_PATH, JSON.stringify(schema, null, 2));
    console.log('✅ Benefits field temporarily removed');
    console.log('📋 Updated homepage fields:', Object.keys(schema.attributes));
    
    console.log('');
    console.log('🔄 Next steps:');
    console.log('1. Run: npm run build');
    console.log('2. Run: npm run restart');
    console.log('3. Check Strapi Admin - 500 error should be gone');
    console.log('');
    console.log('⚠️  To restore benefits field later:');
    console.log('1. Copy from backup file:', backupPath);
    console.log('2. Ensure benefits-section component is registered');
    console.log('3. Rebuild and restart');
    
  } else {
    console.log('ℹ️  Benefits field not found in schema');
    console.log('📋 Current fields:', Object.keys(schema.attributes));
  }
  
} catch (error) {
  console.error('❌ Error fixing homepage schema:', error.message);
  process.exit(1);
}
