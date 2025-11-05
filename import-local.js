/**
 * Import data into LOCAL Strapi from SQL dump files
 * 
 * Prerequisites:
 * 1. Local Strapi must be running (npm run develop)
 * 2. You need to create an admin user first
 * 3. Then create an API token in Settings → API Tokens
 * 
 * Usage:
 * STRAPI_API_TOKEN=your_token_here node import-local.js
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = process.env.STRAPI_ADMIN_CLIENT_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!API_TOKEN) {
  console.error('❌ Error: STRAPI_API_TOKEN environment variable is required');
  console.log('\nTo get your API token:');
  console.log('1. Start local Strapi: npm run develop');
  console.log('2. Go to http://localhost:1337/admin');
  console.log('3. Create an admin account if you haven\'t already');
  console.log('4. Go to Settings → API Tokens → Create new API Token');
  console.log('5. Name: "Import Script", Type: "Full access", Duration: "Unlimited"');
  console.log('6. Copy the token and run:');
  console.log('   STRAPI_API_TOKEN=your_token node import-local.js');
  process.exit(1);
}

// Parse SQL INSERT statement to extract data
function parseSqlInsert(sqlContent, tableName) {
  const insertRegex = new RegExp(`INSERT INTO \`${tableName}\`[^(]*\\(([^)]+)\\)\\s+VALUES`, 's');
  const match = sqlContent.match(insertRegex);
  
  if (!match) {
    console.error(`Could not find INSERT statement for table ${tableName}`);
    return [];
  }
  
  const columns = match[1].split(',').map(col => col.trim().replace(/`/g, ''));
  
  // Find all value rows
  const valuePattern = /\((?:[^()']|'(?:[^'\\]|\\.)*')+\)(?=,\s*$|;)/gm;
  const valueMatches = [...sqlContent.matchAll(valuePattern)];
  
  const result = [];
  for (const match of valueMatches) {
    const rowStr = match[0];
    const values = parseRowValues(rowStr, columns.length);
    
    if (values.length === columns.length) {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = values[idx];
      });
      result.push(obj);
    }
  }
  
  return result;
}

function parseRowValues(rowStr, expectedCount) {
  rowStr = rowStr.slice(1, -1);
  const values = [];
  let current = '';
  let inString = false;
  let i = 0;
  
  while (i < rowStr.length && values.length < expectedCount) {
    const char = rowStr[i];
    
    if (char === "'" && !inString) {
      inString = true;
      i++;
      current = '';
      continue;
    }
    
    if (char === "'" && inString) {
      if (rowStr[i + 1] === "'") {
        current += "'";
        i += 2;
        continue;
      } else {
        inString = false;
        const unescaped = current.replace(/\\\\/g, '\\').replace(/\\'/g, "'").replace(/\\"/g, '"');
        values.push(unescaped);
        current = '';
        while (i < rowStr.length && rowStr[i] !== ',') i++;
        i++;
        while (i < rowStr.length && rowStr[i] === ' ') i++;
        continue;
      }
    }
    
    if (inString) {
      current += char;
      i++;
      continue;
    }
    
    if (char === 'N' && rowStr.substr(i, 4) === 'NULL') {
      values.push(null);
      i += 4;
      while (i < rowStr.length && rowStr[i] !== ',') i++;
      i++;
      while (i < rowStr.length && rowStr[i] === ' ') i++;
      continue;
    }
    
    if (char === ',') {
      if (current.trim()) {
        values.push(current.trim());
      } else {
        values.push(null);
      }
      current = '';
      i++;
      while (i < rowStr.length && rowStr[i] === ' ') i++;
      continue;
    }
    
    current += char;
    i++;
  }
  
  if (current.trim()) {
    if (current.trim() === 'NULL') {
      values.push(null);
    } else {
      values.push(current.trim());
    }
  }
  
  return values;
}

async function fetchFromStrapi(endpoint) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`
    }
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strapi API error: ${response.status} - ${text}`);
  }
  
  return response.json();
}

async function postToStrapi(endpoint, data) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const payload = { 
    ...data, 
    publishedAt: data.publishedAt || new Date().toISOString() 
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ data: payload })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strapi API error: ${response.status} - ${text}`);
  }
  
  return response.json();
}

async function putToStrapi(endpoint, data) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const payload = { 
    ...data, 
    publishedAt: new Date().toISOString() 
  };
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    },
    body: JSON.stringify({ data: payload })
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Strapi API error: ${response.status} - ${text}`);
  }
  
  return response.json();
}

async function importContentData(contentRows) {
  const contentMap = {};
  contentRows.forEach(row => {
    try {
      contentMap[row.section] = JSON.parse(row.data);
    } catch (e) {
      console.error(`Error parsing JSON for section ${row.section}:`, e.message);
    }
  });
  
  // Import Navigation
  if (contentMap.navigation) {
    console.log('\n📋 Importing Navigation...');
    try {
      const navData = contentMap.navigation;
      const menuItems = navData.menu.map(item => ({
        identifier: item.id,
        title: item.title,
        href: item.href
      }));
      
      await putToStrapi('/navigation', {
        logo: navData.logo,
        menuItems: menuItems
      });
      console.log('✅ Navigation imported');
    } catch (error) {
      console.error('❌ Navigation import failed:', error.message);
    }
  }
  
  // Import SEO Settings
  if (contentMap.seo) {
    console.log('\n🔍 Importing SEO Settings...');
    try {
      await putToStrapi('/envicon-seo-config', contentMap.seo);
      console.log('✅ SEO Settings imported');
    } catch (error) {
      console.error('❌ SEO Settings import failed:', error.message);
    }
  }
  
  // Import Footer
  if (contentMap.footer) {
    console.log('\n👣 Importing Footer...');
    try {
      await putToStrapi('/footer', contentMap.footer);
      console.log('✅ Footer imported');
    } catch (error) {
      console.error('❌ Footer import failed:', error.message);
    }
  }
  
  // Import Forms Config
  if (contentMap.forms) {
    console.log('\n📝 Importing Forms Configuration...');
    try {
      await putToStrapi('/forms-config', contentMap.forms);
      console.log('✅ Forms Configuration imported');
    } catch (error) {
      console.error('❌ Forms Configuration import failed:', error.message);
    }
  }
  
  // Import Homepage
  console.log('\n🏠 Importing Homepage...');
  try {
    const processData = contentMap.process ? {
      subtitle: contentMap.process.subtitle,
      title: contentMap.process.title,
      description: contentMap.process.description
    } : null;
    
    const homepageData = {
      hero: contentMap.hero || null,
      about: contentMap.about || null,
      contact: contentMap.contact || null,
      process: processData
    };
    
    await putToStrapi('/homepage', homepageData);
    console.log('✅ Homepage imported');
  } catch (error) {
    console.error('❌ Homepage import failed:', error.message);
  }
  
  // Import Solutions
  if (contentMap.solutions && contentMap.solutions.solutions) {
    console.log('\n🏗️  Importing Solutions...');
    let order = 0;
    for (const solution of contentMap.solutions.solutions) {
      try {
        const solutionData = {
          title: solution.title,
          description: solution.description,
          order: order++
        };
        await postToStrapi('/solutions', solutionData);
        console.log(`  ✅ ${solution.title}`);
      } catch (error) {
        console.error(`  ❌ ${solution.title}:`, error.message);
      }
    }
  }
  
  // Import Sectors
  if (contentMap.sectors && contentMap.sectors.downloadBlocks) {
    console.log('\n🏭 Importing Sectors...');
    let order = 0;
    for (const sector of contentMap.sectors.downloadBlocks) {
      try {
        await postToStrapi('/sectors', {
          title: sector.title,
          description: sector.description,
          downloadUrl: sector.downloadUrl,
          downloadText: sector.downloadText,
          order: order++
        });
        console.log(`  ✅ ${sector.title}`);
      } catch (error) {
        console.error(`  ❌ ${sector.title}:`, error.message);
      }
    }
  }
  
  // Import Services
  if (contentMap.services && contentMap.services.accordions) {
    console.log('\n🔧 Importing Services...');
    let order = 0;
    for (const service of contentMap.services.accordions) {
      try {
        await postToStrapi('/services', {
          title: service.title,
          description: service.description,
          order: order++
        });
        console.log(`  ✅ ${service.title}`);
      } catch (error) {
        console.error(`  ❌ ${service.title}:`, error.message);
      }
    }
  }
  
  // Import Process Steps
  if (contentMap.process && contentMap.process.steps) {
    console.log('\n📋 Importing Process Steps...');
    for (const step of contentMap.process.steps) {
      try {
        await postToStrapi('/process-steps', step);
        console.log(`  ✅ ${step.title}`);
      } catch (error) {
        console.error(`  ❌ ${step.title}:`, error.message);
      }
    }
  }
}

async function importArticles(articleRows) {
  console.log('\n📰 Importing Articles...');
  
  let existingArticles = [];
  try {
    const response = await fetchFromStrapi('/articles?pagination[pageSize]=100');
    existingArticles = response.data || [];
  } catch (error) {
    console.log('  ⚠️  Could not fetch existing articles, will try to create all');
  }
  
  const existingSlugs = new Set(existingArticles.map(a => a.slug || a.attributes?.slug));
  
  for (const article of articleRows) {
    if (article.status !== 'published') continue;
    
    if (existingSlugs.has(article.slug)) {
      console.log(`  ⏭️  ${article.title} (already exists, skipping)`);
      continue;
    }
    
    try {
      let cleanedContent = article.content;
      cleanedContent = cleanedContent.replace(/\\r\\n/g, '\n');
      cleanedContent = cleanedContent.replace(/\\"/g, '"');
      
      let content;
      try {
        content = JSON.parse(cleanedContent);
      } catch (e) {
        cleanedContent = cleanedContent.replace(/\\\\/g, '\\');
        content = JSON.parse(cleanedContent);
      }
      
      await postToStrapi('/articles', {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        publishedAt: article.published_at,
        category: article.category,
        content: content
      });
      console.log(`  ✅ ${article.title}`);
    } catch (error) {
      console.error(`  ❌ ${article.title}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Starting import to LOCAL Strapi CMS');
  console.log(`📍 Target: ${STRAPI_URL}`);
  console.log('');
  
  try {
    // Test connection
    console.log('🔌 Testing Strapi connection...');
    await fetchFromStrapi('/homepage');
    console.log('✅ Strapi is accessible');
    
    // Read content.sql
    console.log('\n📖 Reading content.sql...');
    const contentSql = fs.readFileSync(
      path.join(__dirname, 'content.sql'),
      'utf-8'
    );
    const contentRows = parseSqlInsert(contentSql, 'content');
    console.log(`✅ Found ${contentRows.length} content sections`);
    
    // Read articles.sql
    console.log('\n📖 Reading articles.sql...');
    const articlesSql = fs.readFileSync(
      path.join(__dirname, 'articles.sql'),
      'utf-8'
    );
    const articleRows = parseSqlInsert(articlesSql, 'articles');
    console.log(`✅ Found ${articleRows.length} articles`);
    
    // Import content
    await importContentData(contentRows);
    
    // Import articles
    await importArticles(articleRows);
    
    console.log('\n✅ All data imported successfully to LOCAL Strapi!');
    console.log('\n📋 Summary:');
    console.log(`  - Content sections: ${contentRows.length}`);
    console.log(`  - Articles: ${articleRows.length}`);
    console.log('\nNext steps:');
    console.log('1. Review the imported content at http://localhost:1337/admin');
    console.log('2. Upload images through Media Library');
    console.log('3. Test the local website');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. Local Strapi is running (npm run develop)');
    console.error('2. You have created an admin account');
    console.error('3. Your API token is valid and has full access');
    process.exit(1);
  }
}

// Run import
main();

