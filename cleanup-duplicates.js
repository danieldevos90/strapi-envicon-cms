/**
 * Clean up duplicate entries in Strapi CMS
 * This script removes duplicate entries while keeping the oldest one
 */

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
    throw new Error(`Failed to fetch ${collectionType}: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data || [];
}

async function deleteEntry(collectionType, documentId) {
  const response = await fetch(
    `${STRAPI_URL}/api/${collectionType}/${documentId}`,
    {
      method: 'DELETE',
      headers
    }
  );
  
  return response.ok;
}

function findDuplicates(entries, uniqueField = 'title') {
  const seen = new Map();
  const duplicates = [];
  
  entries.forEach(entry => {
    const key = entry[uniqueField] || entry.attributes?.[uniqueField];
    
    if (!seen.has(key)) {
      // Keep the first (oldest) entry
      seen.set(key, entry);
    } else {
      // Mark as duplicate
      duplicates.push(entry);
    }
  });
  
  return duplicates;
}

async function cleanupCollection(collectionType, uniqueField = 'title') {
  console.log(`\n📋 Processing ${collectionType}...`);
  
  try {
    const entries = await fetchEntries(collectionType);
    console.log(`   Found ${entries.length} total entries`);
    
    const duplicates = findDuplicates(entries, uniqueField);
    console.log(`   Found ${duplicates.length} duplicates`);
    
    if (duplicates.length === 0) {
      console.log('   ✅ No duplicates to remove');
      return { total: entries.length, removed: 0 };
    }
    
    let removed = 0;
    for (const duplicate of duplicates) {
      const id = duplicate.documentId || duplicate.id;
      const title = duplicate.title || duplicate.attributes?.title || 'Unknown';
      
      const success = await deleteEntry(collectionType, id);
      if (success) {
        removed++;
        console.log(`   🗑️  Removed: ${title}`);
      } else {
        console.log(`   ❌ Failed to remove: ${title}`);
      }
    }
    
    console.log(`   ✅ Removed ${removed}/${duplicates.length} duplicates`);
    return { total: entries.length, removed };
    
  } catch (error) {
    console.error(`   ❌ Error processing ${collectionType}:`, error.message);
    return { total: 0, removed: 0, error: error.message };
  }
}

async function main() {
  console.log('🧹 Cleaning up duplicate entries in Strapi CMS');
  console.log('='.repeat(60));
  
  const collections = [
    { name: 'solutions', field: 'title' },
    { name: 'sectors', field: 'title' },
    { name: 'services', field: 'title' },
    { name: 'process-steps', field: 'title' }
  ];
  
  const results = {};
  
  for (const collection of collections) {
    results[collection.name] = await cleanupCollection(collection.name, collection.field);
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log('='.repeat(60));
  
  let totalRemoved = 0;
  for (const [name, result] of Object.entries(results)) {
    if (result.error) {
      console.log(`❌ ${name}: Error - ${result.error}`);
    } else {
      console.log(`✅ ${name}: ${result.total} total, ${result.removed} removed`);
      totalRemoved += result.removed;
    }
  }
  
  console.log('='.repeat(60));
  console.log(`🎉 Total duplicates removed: ${totalRemoved}`);
}

main().catch(console.error);





