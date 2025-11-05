/**
 * Upload images to Strapi Media Library
 * Works for both local and production Strapi
 * 
 * Usage:
 * LOCAL:  node upload-images.js local
 * PRODUCTION: node upload-images.js production
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const args = process.argv.slice(2);
const target = args[0] || 'local';

// Configuration
const config = {
  local: {
    url: 'http://localhost:1337',
    email: 'admin@envicon.nl',
    password: 'Envicon2024!Admin'
  },
  production: {
    url: 'https://cms.envicon.nl',
    token: 'f7eefcea62392f7b26e169f5655357ffbd0d3df8303cdfa7d5a930e7b1a67c10fe1abfcb2894d0a453c8074b01dc527c4ba7b06450f92971ac6ea2f16c71421cb0e2d8c80ab412012e39389db064069cd764e972e3f89afbbd3e009f0f44375eaa7a059edd9c74299bb78663fb91afe5b87b29b5bb38721f06e2e23b910b7a93'
  }
};

const STRAPI_URL = config[target].url;
let authToken = null;

// Images to upload
const imagesToUpload = [
  // Solution images
  { path: '../public/sport-hall.png', name: 'sport-hall.png', category: 'solutions' },
  { path: '../public/modulaire-unit.jpg', name: 'modulaire-unit.jpg', category: 'solutions' },
  { path: '../public/Overkapping.jpg', name: 'Overkapping.jpg', category: 'solutions' },
  { path: '../public/Loods.png', name: 'Loods.png', category: 'solutions' },
  
  // Solution icons
  { path: '../public/eDEMONTABEL 1.svg', name: 'eDEMONTABEL-icon.svg', category: 'icons' },
  { path: '../public/eLOODSEN 1.svg', name: 'eLOODSEN-icon.svg', category: 'icons' },
  { path: '../public/eMODULAIRE 1.svg', name: 'eMODULAIRE-icon.svg', category: 'icons' },
  { path: '../public/eOVERKAPPINGEN 1.svg', name: 'eOVERKAPPINGEN-icon.svg', category: 'icons' },
  
  // Feature icons
  { path: '../public/concierge_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1.svg', name: 'concierge-icon.svg', category: 'icons' },
  { path: '../public/eco_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1.svg', name: 'eco-icon.svg', category: 'icons' },
  { path: '../public/speed_24dp_E8EAED_FILL0_wght400_GRAD0_opsz24 1.svg', name: 'speed-icon.svg', category: 'icons' },
  
  // Article images
  { path: '../public/images/WhatsApp Image 2025-08-05 at 09.18.16.jpeg', name: 'article-giessenburg-hoogtepunt.jpeg', category: 'articles' },
  { path: '../public/images/WhatsApp Image 2025-07-23 at 16.46.32.jpeg', name: 'article-giessenburg-bouw.jpeg', category: 'articles' },
  { path: '../public/images/WhatsApp Image 2025-06-27 at 10.35.19.jpeg', name: 'article-molenlanden.jpeg', category: 'articles' },
  
  // Hero images
  { path: '../public/images/headline-website-1.jpg', name: 'hero-headline-1.jpg', category: 'hero' },
  { path: '../public/images/headline-website-2.jpg', name: 'hero-headline-2.jpg', category: 'hero' }
];

// Login to get auth token
async function login() {
  if (target === 'production') {
    authToken = config.production.token;
    console.log('✅ Using production API token');
    return;
  }
  
  console.log('🔐 Logging in to', target, 'Strapi...');
  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: config[target].email,
      password: config[target].password
    })
  });
  
  const data = await response.json();
  authToken = data.data.token;
  console.log('✅ Logged in');
}

// Upload a single file
async function uploadFile(filePath, fileName, category) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⏭️  ${fileName} - file not found, skipping`);
    return null;
  }
  
  try {
    const formData = new FormData();
    formData.append('files', fs.createReadStream(fullPath), fileName);
    formData.append('fileInfo', JSON.stringify({
      name: fileName,
      caption: fileName,
      alternativeText: fileName.replace(/\.(jpg|jpeg|png|svg|webp)$/i, '')
    }));
    
    // For production, use API token; for local, use admin token
    const headers = target === 'production' 
      ? { 'Authorization': `Bearer ${authToken}` }
      : { 'Authorization': `Bearer ${authToken}` };
    
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: headers,
      body: formData
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${text.substring(0, 100)}`);
    }
    
    const uploadedFiles = await response.json();
    const file = uploadedFiles[0];
    
    console.log(`  ✅ ${fileName} → ID: ${file.id}`);
    return file;
  } catch (error) {
    console.log(`  ❌ ${fileName}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('📤 Uploading Images to Strapi');
  console.log(`🎯 Target: ${target.toUpperCase()} (${STRAPI_URL})`);
  console.log('================================\n');
  
  // Login
  await login();
  
  // Group images by category
  const grouped = {};
  imagesToUpload.forEach(img => {
    if (!grouped[img.category]) grouped[img.category] = [];
    grouped[img.category].push(img);
  });
  
  const uploadedFiles = {};
  
  // Upload by category
  for (const [category, images] of Object.entries(grouped)) {
    console.log(`\n📁 ${category.toUpperCase()}:`);
    
    for (const img of images) {
      const file = await uploadFile(img.path, img.name, category);
      if (file) {
        uploadedFiles[img.name] = file;
      }
      // Small delay to avoid overwhelming the server
      await new Promise(r => setTimeout(r, 200));
    }
  }
  
  console.log('\n✅ Upload complete!');
  console.log(`\n📊 Uploaded ${Object.keys(uploadedFiles).length} files`);
  
  // Save mapping
  const mapping = {};
  Object.entries(uploadedFiles).forEach(([name, file]) => {
    mapping[name] = {
      id: file.id,
      url: file.url,
      formats: file.formats
    };
  });
  
  const mappingFile = `image-mapping-${target}.json`;
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
  console.log(`\n💾 Image mapping saved to: ${mappingFile}`);
  
  console.log('\n📋 Next steps:');
  console.log(`1. Go to ${STRAPI_URL}/admin/content-manager/collection-types/plugin::upload.file`);
  console.log('2. Verify all images are uploaded');
  console.log('3. Link images to Solutions and Articles in Content Manager');
}

main().catch(error => {
  console.error('\n❌ Error:', error);
  process.exit(1);
});

