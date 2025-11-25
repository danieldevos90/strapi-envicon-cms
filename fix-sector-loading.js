/**
 * Fix Sector Content Type Loading Issue
 * 
 * The sector content type is undefined when routes try to load it.
 * This suggests a circular dependency or loading order issue.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing sector content type loading...');

// Check if there are circular dependencies in sector components
const sectorSchemaPath = path.join(__dirname, 'src/api/sector/content-types/sector/schema.json');
const sectorRoutesPath = path.join(__dirname, 'src/api/sector/routes/sector.js');

try {
  // Read sector schema
  const schemaContent = fs.readFileSync(sectorSchemaPath, 'utf8');
  const schema = JSON.parse(schemaContent);
  
  console.log('📋 Sector schema analysis:');
  console.log('  - Attributes:', Object.keys(schema.attributes).length);
  
  // Check for problematic component references
  const problematicComponents = [];
  Object.entries(schema.attributes).forEach(([key, value]) => {
    if (value.type === 'component') {
      console.log(`  - ${key}: ${value.component}`);
      
      // Check if component file exists
      const [namespace, componentName] = value.component.split('.');
      const componentPath = path.join(__dirname, 'src/components', namespace, `${componentName}.json`);
      
      if (!fs.existsSync(componentPath)) {
        problematicComponents.push(value.component);
        console.log(`    ❌ Missing: ${componentPath}`);
      } else {
        console.log(`    ✅ Exists: ${componentPath}`);
      }
    }
  });
  
  if (problematicComponents.length > 0) {
    console.log('');
    console.log('🚨 Found missing components that could cause loading issues:');
    problematicComponents.forEach(comp => console.log(`  - ${comp}`));
    
    // Create backup and remove problematic components
    const backupPath = sectorSchemaPath + '.component-backup';
    fs.writeFileSync(backupPath, schemaContent);
    console.log('💾 Backup created:', backupPath);
    
    // Remove problematic component references
    problematicComponents.forEach(comp => {
      Object.keys(schema.attributes).forEach(key => {
        if (schema.attributes[key].component === comp) {
          console.log(`🗑️  Removing ${key} (${comp})`);
          delete schema.attributes[key];
        }
      });
    });
    
    // Write cleaned schema
    fs.writeFileSync(sectorSchemaPath, JSON.stringify(schema, null, 2));
    console.log('✅ Cleaned sector schema');
    
  } else {
    console.log('✅ All sector components exist');
    
    // The issue might be in the routes file itself
    console.log('');
    console.log('🔧 Creating safer sector routes...');
    
    const saferRoutes = `'use strict';

/**
 * sector router - with delayed loading
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

// Delay router creation to ensure content type is loaded
module.exports = {
  get routes() {
    try {
      // Try to get the content type first
      const contentType = strapi?.contentTypes?.['api::sector.sector'];
      if (!contentType) {
        console.warn('Sector content type not loaded yet, using minimal routes');
        return [
          {
            method: 'POST',
            path: '/sectors/populate-all',
            handler: 'custom-sector.populateAll',
            config: {
              auth: false,
            },
          },
        ];
      }
      
      const defaultRouter = createCoreRouter('api::sector.sector');
      return [
        ...defaultRouter.routes,
        {
          method: 'POST',
          path: '/sectors/populate-all',
          handler: 'custom-sector.populateAll',
          config: {
            auth: false,
          },
        },
      ];
    } catch (error) {
      console.error('Error creating sector routes:', error);
      return [
        {
          method: 'POST',
          path: '/sectors/populate-all',
          handler: 'custom-sector.populateAll',
          config: {
            auth: false,
          },
        },
      ];
    }
  }
};
`;

    // Backup current routes
    const routesContent = fs.readFileSync(sectorRoutesPath, 'utf8');
    const routesBackupPath = sectorRoutesPath + '.loading-backup';
    fs.writeFileSync(routesBackupPath, routesContent);
    console.log('💾 Routes backup created:', routesBackupPath);
    
    // Write safer routes
    fs.writeFileSync(sectorRoutesPath, saferRoutes);
    console.log('✅ Created safer sector routes with delayed loading');
  }
  
  console.log('');
  console.log('🔄 Next steps:');
  console.log('1. npm run build');
  console.log('2. npm run restart');
  
} catch (error) {
  console.error('❌ Error analyzing sector schema:', error.message);
  process.exit(1);
}
