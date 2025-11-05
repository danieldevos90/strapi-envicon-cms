/**
 * Direct Database Import - Bypass API
 * This script imports content directly into the SQLite database
 * No API tokens or permissions needed!
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = './.tmp/data.db';

console.log('🚀 Direct Database Import for Local Strapi');
console.log('==========================================\n');

// Check if database exists
if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Database not found at:', DB_PATH);
  console.error('\nPlease run "npm run develop" first to create the database.');
  process.exit(1);
}

const db = new Database(DB_PATH);

// Parse SQL files
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

try {
  console.log('📖 Reading SQL files...');
  const contentSql = fs.readFileSync(path.join(__dirname, 'content.sql'), 'utf-8');
  const articlesSql = fs.readFileSync(path.join(__dirname, 'articles.sql'), 'utf-8');
  
  const contentRows = parseSqlInsert(contentSql, 'content');
  const articleRows = parseSqlInsert(articlesSql, 'articles');
  
  console.log(`✅ Found ${contentRows.length} content sections`);
  console.log(`✅ Found ${articleRows.length} articles\n`);
  
  const contentMap = {};
  contentRows.forEach(row => {
    try {
      contentMap[row.section] = JSON.parse(row.data);
    } catch (e) {
      console.error(`⚠️  Error parsing ${row.section}`);
    }
  });
  
  console.log('📝 Content sections parsed:');
  Object.keys(contentMap).forEach(key => console.log(`  - ${key}`));
  console.log('');
  
  // List all tables to understand structure
  console.log('📊 Checking Strapi database tables...');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`Found ${tables.length} tables`);
  
  // Find homepage/navigation/etc tables
  const relevantTables = tables.filter(t => 
    t.name.includes('homepage') || 
    t.name.includes('navigation') ||
    t.name.includes('footer') ||
    t.name.includes('article') ||
    t.name.includes('solution') ||
    t.name.includes('sector') ||
    t.name.includes('service')
  );
  
  console.log('\nRelevant tables:');
  relevantTables.forEach(t => console.log(`  - ${t.name}`));
  
  console.log('\n✅ Database analysis complete');
  console.log('\n📝 To import, Strapi must be restarted first.');
  console.log('   Then use: node auto-setup-and-import.js');
  
  db.close();
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
}

