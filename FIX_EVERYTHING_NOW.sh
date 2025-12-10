#!/bin/bash

echo "🔧 FIXING LOCAL STRAPI - Complete Setup"
echo "========================================"
echo ""

# Step 1: Set permissions in database
echo "1️⃣  Enabling public API permissions in database..."
node -e "
const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db', { readonly: false });

// Get all permission IDs linked to public role
const publicRole = db.prepare('SELECT id FROM up_roles WHERE type = ?').get('public');
const permLinks = db.prepare('SELECT permission_id FROM up_permissions_role_lnk WHERE role_id = ?').all(publicRole.id);

console.log('Found', permLinks.length, 'permission links for public role');

// There's no 'enabled' column - permissions are enabled by existing in the link table
// Let's check if our API permissions are linked
const apiActions = [
  'api::article.find',
  'api::article.findOne',
  'api::solution.find',
  'api::solution.findOne',
  'api::sector.find',
  'api::sector.findOne',
  'api::service.find',
  'api::service.findOne',
  'api::process-step.find',
  'api::process-step.findOne',
  'api::homepage.find',
  'api::navigation.find',
  'api::footer.find',
  'api::envicon-seo-config.find'
];

const linkedPermIds = new Set(permLinks.map(l => l.permission_id));

for (const action of apiActions) {
  const perm = db.prepare('SELECT id FROM up_permissions WHERE action = ?').get(action);
  if (perm && !linkedPermIds.has(perm.id)) {
    // Link it
    db.prepare('INSERT INTO up_permissions_role_lnk (permission_id, role_id) VALUES (?, ?)').run(perm.id, publicRole.id);
    console.log('Linked:', action);
  }
}

db.close();
console.log('✅ Permissions configured');
"

echo ""
echo "2️⃣  Verifying content is published..."
node -e "
const Database = require('better-sqlite3');
const db = new Database('./.tmp/data.db', { readonly: false });

const now = new Date().toISOString();

// Make sure everything is published
db.prepare('UPDATE articles SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE solutions SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE sectors SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE services SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE process_steps SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE homepages SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE navigations SET published_at = ? WHERE published_at IS NULL').run(now);
db.prepare('UPDATE footers SET published_at = ? WHERE published_at IS NULL').run(now);

const articles = db.prepare('SELECT COUNT(*) as c FROM articles WHERE published_at IS NOT NULL').get();
const solutions = db.prepare('SELECT COUNT(*) as c FROM solutions WHERE published_at IS NOT NULL').get();

console.log('Published articles:', articles.c);
console.log('Published solutions:', solutions.c);

db.close();
console.log('✅ All content published');
"

echo ""
echo "3️⃣  Restart Strapi to apply changes..."
echo "   In the terminal where Strapi is running:"
echo "   Press Ctrl+C, then run: npm run develop"
echo ""
echo "4️⃣  After Strapi restarts, test API:"
echo "   curl http://localhost:1337/api/articles"
echo ""
echo "5️⃣  Restart frontend to see content:"
echo "   cd .. && npm run dev"
echo ""
echo "✅ Setup script complete!"
echo "   Now restart Strapi for changes to take effect"





