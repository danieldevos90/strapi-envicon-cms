/**
 * Import content using admin login (bypasses public API restrictions)
 */

const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@envicon.nl';
const ADMIN_PASSWORD = 'Envicon2024!Admin';

let adminJWT = null;

// Login as admin
async function loginAsAdmin() {
  console.log('🔐 Logging in as admin...');
  
  const response = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  const data = await response.json();
  adminJWT = data.data.token || data.data.accessToken;
  console.log('✅ Logged in successfully!');
  console.log(`   Token: ${adminJWT.substring(0, 50)}...`);
  return adminJWT;
}

// Admin API call
async function adminAPI(endpoint, method = 'GET', body = null) {
  const url = `${STRAPI_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminJWT}`,
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${method} ${endpoint}: ${response.status} - ${text.substring(0, 200)}`);
  }

  return response.json();
}

// Parse SQL files (same as before)
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

async function main() {
  console.log('🚀 Admin Import - Local Strapi');
  console.log('==============================\n');

  try {
    // Login first
    await loginAsAdmin();
    
    // Read SQL files
    console.log('\n📖 Reading SQL files...');
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
        console.error(`⚠️  Error parsing ${row.section}:`, e.message);
      }
    });
    
    // Import using Content Manager API
    console.log('📋 Importing Navigation...');
    try {
      const navData = contentMap.navigation;
      const menuItems = navData.menu.map(item => ({
        identifier: item.id,
        title: item.title,
        href: item.href
      }));
      
      await adminAPI('/content-manager/single-types/api::navigation.navigation', 'PUT', {
        logo: navData.logo,
        menuItems,
        publishedAt: new Date().toISOString()
      });
      console.log('✅ Navigation imported');
    } catch (error) {
      console.error('❌ Navigation:', error.message);
    }
    
    // Import SEO
    console.log('🔍 Importing SEO...');
    try {
      await adminAPI('/content-manager/single-types/api::envicon-seo-config.envicon-seo-config', 'PUT', {
        ...contentMap.seo,
        publishedAt: new Date().toISOString()
      });
      console.log('✅ SEO Config imported');
    } catch (error) {
      console.error('❌ SEO:', error.message);
    }
    
    // Import Footer
    console.log('👣 Importing Footer...');
    try {
      await adminAPI('/content-manager/single-types/api::footer.footer', 'PUT', {
        ...contentMap.footer,
        publishedAt: new Date().toISOString()
      });
      console.log('✅ Footer imported');
    } catch (error) {
      console.error('❌ Footer:', error.message);
    }
    
    // Import Homepage
    console.log('🏠 Importing Homepage...');
    try {
      const processData = contentMap.process ? {
        subtitle: contentMap.process.subtitle,
        title: contentMap.process.title,
        description: contentMap.process.description
      } : null;
      
      await adminAPI('/content-manager/single-types/api::homepage.homepage', 'PUT', {
        hero: contentMap.hero,
        about: contentMap.about,
        contact: contentMap.contact,
        process: processData,
        publishedAt: new Date().toISOString()
      });
      console.log('✅ Homepage imported');
    } catch (error) {
      console.error('❌ Homepage:', error.message);
    }
    
    // Import Solutions
    if (contentMap.solutions?.solutions) {
      console.log('🏗️  Importing Solutions...');
      for (let i = 0; i < contentMap.solutions.solutions.length; i++) {
        const solution = contentMap.solutions.solutions[i];
        try {
          await adminAPI('/content-manager/collection-types/api::solution.solution', 'POST', {
            title: solution.title,
            description: solution.description,
            order: i,
            publishedAt: new Date().toISOString()
          });
          console.log(`✅ ${solution.title}`);
        } catch (error) {
          console.error(`❌ ${solution.title}:`, error.message.substring(0, 80));
        }
      }
    }
    
    // Import Sectors
    if (contentMap.sectors?.downloadBlocks) {
      console.log('🏭 Importing Sectors...');
      for (let i = 0; i < contentMap.sectors.downloadBlocks.length; i++) {
        const sector = contentMap.sectors.downloadBlocks[i];
        try {
          await adminAPI('/content-manager/collection-types/api::sector.sector', 'POST', {
            title: sector.title,
            description: sector.description,
            downloadUrl: sector.downloadUrl || '',
            downloadText: sector.downloadText,
            order: i,
            publishedAt: new Date().toISOString()
          });
          console.log(`✅ ${sector.title}`);
        } catch (error) {
          console.error(`❌ ${sector.title}:`, error.message.substring(0, 80));
        }
      }
    }
    
    // Import Services
    if (contentMap.services?.accordions) {
      console.log('🔧 Importing Services...');
      for (let i = 0; i < contentMap.services.accordions.length; i++) {
        const service = contentMap.services.accordions[i];
        try {
          await adminAPI('/content-manager/collection-types/api::service.service', 'POST', {
            title: service.title,
            description: service.description,
            order: i,
            publishedAt: new Date().toISOString()
          });
          console.log(`✅ ${service.title}`);
        } catch (error) {
          console.error(`❌ ${service.title}:`, error.message.substring(0, 80));
        }
      }
    }
    
    // Import Process Steps
    if (contentMap.process?.steps) {
      console.log('📋 Importing Process Steps...');
      for (const step of contentMap.process.steps) {
        try {
          await adminAPI('/content-manager/collection-types/api::process-step.process-step', 'POST', {
            ...step,
            publishedAt: new Date().toISOString()
          });
          console.log(`✅ ${step.title}`);
        } catch (error) {
          console.error(`❌ ${step.title}:`, error.message.substring(0, 80));
        }
      }
    }
    
    // Import Articles
    console.log('📰 Importing Articles...');
    for (const article of articleRows) {
      if (article.status !== 'published') continue;
      
      try {
        let cleanedContent = article.content;
        cleanedContent = cleanedContent.replace(/\\r\\n/g, '\n');
        cleanedContent = cleanedContent.replace(/\\"/g, '"');
        
        let content;
        try {
          content = JSON.parse(cleanedContent);
        } catch (e) {
          // Try additional cleaning
          cleanedContent = cleanedContent.replace(/\\\\/g, '\\');
          try {
            content = JSON.parse(cleanedContent);
          } catch (e2) {
            console.error(`  ⏭️  ${article.title} - JSON parse error, skipping`);
            continue;
          }
        }
        
        await adminAPI('/content-manager/collection-types/api::article.article', 'POST', {
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
        if (error.message.includes('already exists') || error.message.includes('unique')) {
          console.log(`⏭️  ${article.title} (exists)`);
        } else {
          console.error(`❌ ${article.title}:`, error.message.substring(0, 100));
        }
      }
    }
    
    console.log('\n✅ Import Complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Go to http://localhost:1337/admin');
    console.log('2. Click Content Manager');
    console.log('3. All content should be there!');
    console.log('4. Update .env.local to use http://localhost:1337');
    console.log('5. Restart frontend: npm run dev');
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();

