#!/bin/bash

# Fix sector routes and rebuild Strapi
# This ensures the fix is applied and Strapi can start

echo "🔧 Fixing Sector Routes and Rebuilding Strapi"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Fix sector routes
echo "1️⃣ Fixing sector routes..."
node fix-sector-routes-now.js
echo ""

# Step 2: Remove old build
echo "2️⃣ Removing old build files..."
rm -rf dist build .cache
echo "✅ Build files removed"
echo ""

# Step 3: Rebuild
echo "3️⃣ Rebuilding Strapi..."
echo "   This may take 30-60 seconds..."
npm run build
echo ""

# Step 4: Verify
echo "4️⃣ Verifying sector routes..."
if [ -f "dist/src/api/sector/routes/sector.js" ]; then
    echo "✅ Build file exists"
    if grep -q "createCoreRouter('api::sector.sector')" dist/src/api/sector/routes/sector.js; then
        echo "✅ Sector routes are correct"
    else
        echo "⚠️  Sector routes may still have issues"
    fi
else
    echo "⚠️  Build file not found"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Fix and rebuild complete!"
echo ""
echo "Next: Restart Strapi via Plesk"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

