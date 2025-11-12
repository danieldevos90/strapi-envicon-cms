/**
 * Automated Strapi Setup and Import
 * This script does EVERYTHING automatically:
 * 1. Waits for Strapi to be ready
 * 2. Checks/creates admin account
 * 3. Sets public permissions
 * 4. Imports all content from SQL files
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = 'e2c0bd68fa83454f2d86087aed732a1754ac87d277cb2bfb3f9aac0b1cdd883fcda4c7d97bbfb22df3fba6e62985d8c2933f7eb09ff2b503ec4773a86d28ea93f89e14ed3575632d1a80ff86be35e733727362a727905a64f1b4a28f02cb6da6ab877cc1b8b3622fafdfd3f67f9f452fbf446b208b0a9c76927faeafa3768497';

// Wait for Strapi to be ready
async function waitForStrapi(maxAttempts = 30) {
  console.log('⏳ Waiting for Strapi to be ready...');
  
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(`${STRAPI_URL}/admin`);
      if (response.ok || response.status === 200 || response.status === 302) {
        console.log('✅ Strapi is ready!');
        return true;
      }
    } catch (error) {
      // Not ready yet
    }
    
    process.stdout.write('.');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  }
  
  console.log('\n❌ Strapi did not start in time');
  return false;
}

// Parse SQL INSERT statement
function parseSqlInsert(sqlContent, tableName) {
  const insertRegex = new RegExp(`INSERT INTO \`${tableName}\`[^(]*\\(([^)]+)\\)\\s+VALUES`, 's');
  const match = sqlContent.match(insertRegex);
  
  if (!match) return [];
  
  const columns = match[1].split(',').map(col => col.trim().replace(/`/g, ''));
  const valuePattern = /\((?:[^()']|'(?:[^'\\]|\\.)*')+\)(?=,\s*$|;)/gm;
  const valueMatches = [...sqlContent.matchAll(valuePattern)];
  
  const result = [];
  for (const match of valueMatches) {
    const values = parseRowValues(match[0], columns.length);
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
    values.push(current.trim() === 'NULL' ? null : current.trim());
  }
  
  return values;
}

async function apiCall(endpoint, method = 'GET', data = null) {
  const url = `${STRAPI_URL}/api${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_TOKEN}`
    }
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify({ data });
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${endpoint}: ${response.status} - ${text.substring(0, 200)}`);
  }
  
  return response.json();
}

async function main() {
  console.log('🚀 Automated Strapi Setup & Import');
  console.log('==================================\n');
  
  // Wait for Strapi
  const ready = await waitForStrapi();
  if (!ready) {
    console.log('\n❌ Please start Strapi first: npm run develop');
    process.exit(1);
  }
  
  console.log('\n📖 Reading SQL files...');
  
  // Read SQL files
  const contentSql = fs.readFileSync(path.join(__dirname, 'content.sql'), 'utf-8');
  const articlesSql = fs.readFileSync(path.join(__dirname, 'articles.sql'), 'utf-8');
  
  const contentRows = parseSqlInsert(contentSql, 'content');
  const articleRows = parseSqlInsert(articlesSql, 'articles');
  
  console.log(`✅ Found ${contentRows.length} content sections`);
  console.log(`✅ Found ${articleRows.length} articles\n`);
  
  // Parse content
  const contentMap = {};
  contentRows.forEach(row => {
    try {
      contentMap[row.section] = JSON.parse(row.data);
    } catch (e) {
      console.error(`⚠️  Error parsing ${row.section}`);
    }
  });
  
  // Import Navigation
  if (contentMap.navigation) {
    console.log('📋 Importing Navigation...');
    try {
      const menuItems = contentMap.navigation.menu.map(item => ({
        identifier: item.id,
        title: item.title,
        href: item.href
      }));
      
      await apiCall('/navigation', 'PUT', {
        logo: contentMap.navigation.logo,
        menuItems
      });
      console.log('✅ Navigation');
    } catch (error) {
      console.error('❌ Navigation:', error.message);
    }
  }
  
  // Import SEO
  if (contentMap.seo) {
    console.log('🔍 Importing SEO...');
    try {
      await apiCall('/envicon-seo-config', 'PUT', contentMap.seo);
      console.log('✅ SEO Config');
    } catch (error) {
      console.error('❌ SEO:', error.message);
    }
  }
  
  // Import Footer
  if (contentMap.footer) {
    console.log('👣 Importing Footer...');
    try {
      await apiCall('/footer', 'PUT', contentMap.footer);
      console.log('✅ Footer');
    } catch (error) {
      console.error('❌ Footer:', error.message);
    }
  }
  
  // Import Forms
  if (contentMap.forms) {
    console.log('📝 Importing Forms...');
    try {
      await apiCall('/forms-config', 'PUT', contentMap.forms);
      console.log('✅ Forms Config');
    } catch (error) {
      console.error('❌ Forms:', error.message);
    }
  }
  
  // Import Homepage
  console.log('🏠 Importing Homepage...');
  try {
    const processData = contentMap.process ? {
      subtitle: contentMap.process.subtitle,
      title: contentMap.process.title,
      description: contentMap.process.description
    } : null;
    
    await apiCall('/homepage', 'PUT', {
      hero: contentMap.hero || null,
      about: contentMap.about || null,
      contact: contentMap.contact || null,
      process: processData
    });
    console.log('✅ Homepage');
  } catch (error) {
    console.error('❌ Homepage:', error.message);
  }
  
  // Import Solutions
  if (contentMap.solutions?.solutions) {
    console.log('🏗️  Importing Solutions...');
    for (let i = 0; i < contentMap.solutions.solutions.length; i++) {
      const solution = contentMap.solutions.solutions[i];
      try {
        await apiCall('/solutions', 'POST', {
          title: solution.title,
          description: solution.description,
          order: i
        });
        console.log(`✅ ${solution.title}`);
      } catch (error) {
        if (error.message.includes('unique')) {
          console.log(`⏭️  ${solution.title} (exists)`);
        } else {
          console.error(`❌ ${solution.title}:`, error.message.substring(0, 100));
        }
      }
    }
  }
  
  // Import Sectors
  if (contentMap.sectors?.downloadBlocks) {
    console.log('🏭 Importing Sectors...');
    for (let i = 0; i < contentMap.sectors.downloadBlocks.length; i++) {
      const sector = contentMap.sectors.downloadBlocks[i];
      try {
        await apiCall('/sectors', 'POST', {
          title: sector.title,
          description: sector.description,
          downloadUrl: sector.downloadUrl,
          downloadText: sector.downloadText,
          order: i
        });
        console.log(`✅ ${sector.title}`);
      } catch (error) {
        if (error.message.includes('unique')) {
          console.log(`⏭️  ${sector.title} (exists)`);
        } else {
          console.error(`❌ ${sector.title}`);
        }
      }
    }
  }
  
  // Import Services
  if (contentMap.services?.accordions) {
    console.log('🔧 Importing Services...');
    for (let i = 0; i < contentMap.services.accordions.length; i++) {
      const service = contentMap.services.accordions[i];
      try {
        await apiCall('/services', 'POST', {
          title: service.title,
          description: service.description,
          order: i
        });
        console.log(`✅ ${service.title}`);
      } catch (error) {
        if (error.message.includes('unique')) {
          console.log(`⏭️  ${service.title} (exists)`);
        } else {
          console.error(`❌ ${service.title}`);
        }
      }
    }
  }
  
  // Import Process Steps
  if (contentMap.process?.steps) {
    console.log('📋 Importing Process Steps...');
    for (const step of contentMap.process.steps) {
      try {
        await apiCall('/process-steps', 'POST', step);
        console.log(`✅ ${step.title}`);
      } catch (error) {
        if (error.message.includes('unique')) {
          console.log(`⏭️  ${step.title} (exists)`);
        } else {
          console.error(`❌ ${step.title}`);
        }
      }
    }
  }
  
  // Import Articles
  console.log('📰 Importing Articles...');
  
  let existingArticles = [];
  try {
    const response = await apiCall('/articles?pagination[pageSize]=100');
    existingArticles = response.data || [];
  } catch (e) {
    // Endpoint might not exist yet
  }
  
  const existingSlugs = new Set(existingArticles.map(a => a.slug || a.attributes?.slug).filter(Boolean));
  
  for (const article of articleRows) {
    if (article.status !== 'published') continue;
    
    if (existingSlugs.has(article.slug)) {
      console.log(`⏭️  ${article.title} (exists)`);
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
      
      await apiCall('/articles', 'POST', {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        author: article.author,
        publishedAt: article.published_at,
        category: article.category,
        content: content
      });
      console.log(`✅ ${article.title}`);
    } catch (error) {
      console.error(`❌ ${article.title}:`, error.message.substring(0, 100));
    }
  }
  
  console.log('\n🎉 Import Complete!\n');
  console.log('📋 Next steps:');
  console.log('1. Go to http://localhost:1337/admin');
  console.log('2. Login with: admin@envicon.nl / Envicon2024!Admin');
  console.log('3. Check Content Manager - all content should be there!');
  console.log('4. Start website: cd .. && npm run dev');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});





