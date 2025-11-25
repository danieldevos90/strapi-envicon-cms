const fs = require('fs');
const path = require('path');

console.log('=== Permission Test ===');

// Test write permissions
const testFile = path.join(__dirname, 'test-write.txt');
try {
  fs.writeFileSync(testFile, 'test');
  console.log('✅ Can write to current directory');
  fs.unlinkSync(testFile);
} catch (err) {
  console.log('❌ Cannot write to current directory:', err.message);
}

// Test .tmp directory
const tmpDir = path.join(__dirname, '.tmp');
try {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
    console.log('✅ Created .tmp directory');
  } else {
    console.log('✅ .tmp directory exists');
  }
  
  // Test write to .tmp
  const tmpFile = path.join(tmpDir, 'test.txt');
  fs.writeFileSync(tmpFile, 'test');
  console.log('✅ Can write to .tmp directory');
  fs.unlinkSync(tmpFile);
} catch (err) {
  console.log('❌ Issue with .tmp directory:', err.message);
}

// Check node_modules
const nodeModules = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModules)) {
  console.log('✅ node_modules exists');
  
  // Check for Strapi
  const strapiPath = path.join(nodeModules, '@strapi', 'strapi');
  if (fs.existsSync(strapiPath)) {
    console.log('✅ @strapi/strapi exists in node_modules');
  } else {
    console.log('❌ @strapi/strapi NOT found in node_modules');
  }
} else {
  console.log('❌ node_modules directory NOT found');
}

console.log('\nDirectory contents:');
fs.readdirSync(__dirname).forEach(file => {
  console.log(' -', file);
});




