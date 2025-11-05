/**
 * Link uploaded media to content items in Strapi
 */

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const STRAPI_URL = process.env.STRAPI_URL || 'https://cms.envicon.nl';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('❌ Please set STRAPI_API_TOKEN environment variable');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${STRAPI_API_TOKEN}`
};

async function fetchEntries(collectionType) {
  const response = await fetch(
    `${STRAPI_URL}/api/${collectionType}?pagination[pageSize]=100`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${collectionType}`);
  }
  
  const data = await response.json();
  return data.data || [];
}

async function updateEntry(collectionType, documentId, data) {
  const response = await fetch(
    `${STRAPI_URL}/api/${collectionType}/${documentId}`,
    {
      method: 'PUT',
      headers,
      body: JSON.stringify({ data })
    }
  );
  
  return response.ok;
}

async function linkSolutionImages() {
  console.log('\n📎 Linking images to Solutions...');
  
  // Load uploaded media IDs
  const uploadedMediaPath = path.join(__dirname, 'uploaded-media.json');
  if (!fs.existsSync(uploadedMediaPath)) {
    console.log('   ⚠️  No uploaded media file found. Run upload-media.js first.');
    return;
  }
  
  const uploadedMedia = JSON.parse(fs.readFileSync(uploadedMediaPath, 'utf8'));
  
  const solutions = await fetchEntries('solutions');
  
  // Mapping of solution titles to media
  const solutionMediaMap = {
    'Demontabel gebouw': {
      icon: uploadedMedia.solutions.find(m => m.name === 'demontabel-icon.svg')?.id,
      image: uploadedMedia.solutions.find(m => m.name === 'sport-hall.png')?.id
    },
    'Overkapping': {
      icon: uploadedMedia.solutions.find(m => m.name === 'overkapping-icon.svg')?.id,
      image: uploadedMedia.solutions.find(m => m.name === 'overkapping-image.jpg')?.id
    },
    'Modulaire unit': {
      icon: uploadedMedia.solutions.find(m => m.name === 'modulair-icon.svg')?.id,
      image: uploadedMedia.solutions.find(m => m.name === 'modulaire-unit-image.jpg')?.id
    },
    'Loods': {
      icon: uploadedMedia.solutions.find(m => m.name === 'loods-icon.svg')?.id,
      image: uploadedMedia.solutions.find(m => m.name === 'loods-image.png')?.id
    }
  };
  
  let updated = 0;
  for (const solution of solutions) {
    const title = solution.title || solution.attributes?.title;
    const media = solutionMediaMap[title];
    
    if (media && (media.icon || media.image)) {
      const documentId = solution.documentId || solution.id;
      const updateData = {};
      
      if (media.icon) updateData.icon = media.icon;
      if (media.image) updateData.image = media.image;
      
      const success = await updateEntry('solutions', documentId, updateData);
      if (success) {
        console.log(`   ✅ Updated: ${title}`);
        updated++;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`   📊 Updated ${updated} solutions`);
}

async function linkArticleImages() {
  console.log('\n📎 Linking images to Articles...');
  
  const uploadedMediaPath = path.join(__dirname, 'uploaded-media.json');
  if (!fs.existsSync(uploadedMediaPath)) {
    console.log('   ⚠️  No uploaded media file found. Run upload-media.js first.');
    return;
  }
  
  const uploadedMedia = JSON.parse(fs.readFileSync(uploadedMediaPath, 'utf8'));
  
  const articles = await fetchEntries('articles');
  
  // Mapping of article slugs to media
  const articleMediaMap = {
    'gemeente-molenlanden-gunt-opdracht-aan-envicon': 
      uploadedMedia.articles.find(m => m.name === 'molenlanden-project.jpeg')?.id,
    'bouw-start-duurzame-demontabele-huisvesting-giessenburg': 
      uploadedMedia.articles.find(m => m.name === 'giessenburg-construction.jpeg')?.id,
    'hoogtepunt-bereikt-in-giessenburg': 
      uploadedMedia.articles.find(m => m.name === 'giessenburg-progress.jpeg')?.id
  };
  
  let updated = 0;
  for (const article of articles) {
    const slug = article.slug || article.attributes?.slug;
    const imageId = articleMediaMap[slug];
    
    if (imageId) {
      const documentId = article.documentId || article.id;
      const success = await updateEntry('articles', documentId, { featuredImage: imageId });
      
      if (success) {
        const title = article.title || article.attributes?.title;
        console.log(`   ✅ Updated: ${title}`);
        updated++;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`   📊 Updated ${updated} articles`);
}

async function linkSectorBrochures() {
  console.log('\n📎 Linking brochures to Sectors...');
  
  const uploadedMediaPath = path.join(__dirname, 'uploaded-media.json');
  if (!fs.existsSync(uploadedMediaPath)) {
    console.log('   ⚠️  No uploaded media file found. Run upload-media.js first.');
    return;
  }
  
  const uploadedMedia = JSON.parse(fs.readFileSync(uploadedMediaPath, 'utf8'));
  const brochureId = uploadedMedia.brochures.find(m => m.name === 'envicon-brochure-2025.pdf')?.id;
  
  if (!brochureId) {
    console.log('   ⚠️  Brochure not found in uploaded media');
    return;
  }
  
  const sectors = await fetchEntries('sectors');
  
  let updated = 0;
  for (const sector of sectors) {
    const title = sector.title || sector.attributes?.title;
    
    if (title === 'Recycling') {
      const documentId = sector.documentId || sector.id;
      const success = await updateEntry('sectors', documentId, { brochure: brochureId });
      
      if (success) {
        console.log(`   ✅ Updated: ${title}`);
        updated++;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`   📊 Updated ${updated} sectors`);
}

async function main() {
  console.log('🔗 Linking media to content items');
  console.log('='.repeat(60));
  
  try {
    await linkSolutionImages();
    await linkArticleImages();
    await linkSectorBrochures();
    
    console.log('\n' + '='.repeat(60));
    console.log('🎉 Media linking complete!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main().catch(console.error);

