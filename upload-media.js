/**
 * Upload media files to Strapi CMS
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ Please set STRAPI_API_TOKEN environment variable');
  process.exit(1);
}

// Media files to upload
const MEDIA_FILES = {
  solutions: [
    { file: '../public/eDEMONTABEL 1.svg', name: 'demontabel-icon.svg', alt: 'Demontabel gebouw icon' },
    { file: '../public/eOVERKAPPINGEN 1.svg', name: 'overkapping-icon.svg', alt: 'Overkapping icon' },
    { file: '../public/eMODULAIRE 1.svg', name: 'modulair-icon.svg', alt: 'Modulaire unit icon' },
    { file: '../public/eLOODSEN 1.svg', name: 'loods-icon.svg', alt: 'Loods icon' },
    { file: '../public/Loods.png', name: 'loods-image.png', alt: 'Loods' },
    { file: '../public/Overkapping.jpg', name: 'overkapping-image.jpg', alt: 'Overkapping' },
    { file: '../public/modulaire-unit.jpg', name: 'modulaire-unit-image.jpg', alt: 'Modulaire unit' },
    { file: '../public/sport-hall.png', name: 'sport-hall.png', alt: 'Sporthal' }
  ],
  articles: [
    { file: '../public/images/WhatsApp Image 2025-06-27 at 10.35.19.jpeg', name: 'molenlanden-project.jpeg', alt: 'Project Molenlanden' },
    { file: '../public/images/WhatsApp Image 2025-07-23 at 16.46.32.jpeg', name: 'giessenburg-construction.jpeg', alt: 'Bouw Giessenburg' },
    { file: '../public/images/WhatsApp Image 2025-08-05 at 09.18.16.jpeg', name: 'giessenburg-progress.jpeg', alt: 'Voortgang Giessenburg' }
  ],
  brochures: [
    { file: '../public/brochures/Envicon-onepage-2025.pdf', name: 'envicon-brochure-2025.pdf', alt: 'Envicon Brochure 2025' }
  ],
  general: [
    { file: '../public/images/headline-website-1.jpg', name: 'hero-1.jpg', alt: 'Hero image 1' },
    { file: '../public/images/headline-website-2.jpg', name: 'hero-2.jpg', alt: 'Hero image 2' }
  ]
};

async function uploadFile(filePath, fileName, altText) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`   ⚠️  File not found: ${filePath}`);
    return null;
  }
  
  const formData = new FormData();
  formData.append('files', fs.createReadStream(fullPath), fileName);
  formData.append('fileInfo', JSON.stringify({
    name: fileName,
    alternativeText: altText,
    caption: altText
  }));
  
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_API_TOKEN}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.log(`   ❌ Failed to upload ${fileName}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    console.log(`   ✅ Uploaded: ${fileName} (ID: ${data[0]?.id})`);
    return data[0];
  } catch (error) {
    console.log(`   ❌ Error uploading ${fileName}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('📤 Uploading media files to Strapi CMS');
  console.log('='.repeat(60));
  
  const uploadedFiles = {
    solutions: [],
    articles: [],
    brochures: [],
    general: []
  };
  
  for (const [category, files] of Object.entries(MEDIA_FILES)) {
    console.log(`\n📁 Uploading ${category} files...`);
    
    for (const fileInfo of files) {
      const result = await uploadFile(fileInfo.file, fileInfo.name, fileInfo.alt);
      if (result) {
        uploadedFiles[category].push({
          ...fileInfo,
          id: result.id,
          url: result.url
        });
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Save the uploaded file IDs for linking
  const outputPath = path.join(__dirname, 'uploaded-media.json');
  fs.writeFileSync(outputPath, JSON.stringify(uploadedFiles, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));
  
  let totalUploaded = 0;
  for (const [category, files] of Object.entries(uploadedFiles)) {
    console.log(`✅ ${category}: ${files.length} files uploaded`);
    totalUploaded += files.length;
  }
  
  console.log('='.repeat(60));
  console.log(`🎉 Total files uploaded: ${totalUploaded}`);
  console.log(`💾 File IDs saved to: ${outputPath}`);
}

main().catch(console.error);

