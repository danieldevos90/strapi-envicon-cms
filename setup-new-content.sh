#!/bin/bash

# Setup New Content Types in Strapi
# This script builds Strapi with the new content types and restarts the service

set -e

echo "🚀 Setting up new content types in Strapi..."
echo ""

# Navigate to strapi-cms directory
cd "$(dirname "$0")"

# Step 1: Clean build artifacts
echo "🧹 Cleaning build artifacts..."
rm -rf dist/ .cache/ .strapi/ build/
echo "✅ Clean complete"
echo ""

# Step 2: Install dependencies (if needed)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Step 3: Build Strapi
echo "🔨 Building Strapi..."
npm run build
echo "✅ Build complete"
echo ""

# Step 4: Verify build
echo "🔍 Verifying build..."
if [ -f "verify-build.js" ]; then
    node verify-build.js
else
    echo "⚠️  verify-build.js not found, skipping verification"
fi
echo ""

# Step 5: Restart Strapi (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting Strapi with PM2..."
    pm2 restart strapi-cms || echo "⚠️  PM2 process 'strapi-cms' not found"
    echo "✅ Restart complete"
else
    echo "⚠️  PM2 not found. Please restart Strapi manually:"
    echo "   For development: npm run develop"
    echo "   For production: NODE_ENV=production npm start"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Open Strapi admin: http://localhost:1337/admin"
echo "2. Go to Settings → Roles → Public"
echo "3. Enable permissions for new content types:"
echo "   - Service: find, findOne"
echo "   - About Page: find"
echo "   - Contact Page: find"
echo "4. Run import script: STRAPI_API_TOKEN=your_token node import-rtf-content.js"
echo ""

