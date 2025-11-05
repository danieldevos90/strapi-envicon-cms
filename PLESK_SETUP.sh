#!/bin/bash
#
# Complete Strapi CMS Setup Script for Plesk
# This script does EVERYTHING: build, configure, and import content
#
# Usage in Plesk Terminal:
#   cd ~/httpdocs/strapi-cms  (or your strapi path)
#   chmod +x PLESK_SETUP.sh
#   ./PLESK_SETUP.sh
#
# Or run with your API token:
#   STRAPI_API_TOKEN=your_token ./PLESK_SETUP.sh
#

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     ENVICON STRAPI CMS - COMPLETE SETUP SCRIPT             ║"
echo "║     Builds, Configures & Imports ALL Content               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# ============================================
# STEP 1: Install Dependencies
# ============================================
echo "📦 Step 1/5: Installing dependencies..."
echo "────────────────────────────────────────────────────────────"

if [ ! -d "node_modules" ] || [ ! -d "node_modules/axios" ]; then
    echo "   Installing npm packages (including axios)..."
    npm install
    echo "   ✅ Dependencies installed"
else
    echo "   ✅ Dependencies already installed"
fi
echo ""

# ============================================
# STEP 2: Clean Build Artifacts
# ============================================
echo "🧹 Step 2/5: Cleaning old build artifacts..."
echo "────────────────────────────────────────────────────────────"

echo "   Removing dist/, .cache/, .strapi/, build/..."
rm -rf dist/ .cache/ .strapi/ build/
echo "   ✅ Clean complete"
echo ""

# ============================================
# STEP 3: Build Strapi
# ============================================
echo "🔨 Step 3/5: Building Strapi..."
echo "────────────────────────────────────────────────────────────"

npm run build

if [ -d "dist" ]; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed - dist directory not created"
    exit 1
fi
echo ""

# ============================================
# STEP 4: Restart Strapi
# ============================================
echo "🔄 Step 4/5: Restarting Strapi..."
echo "────────────────────────────────────────────────────────────"

# Try PM2 first
if command -v pm2 &> /dev/null; then
    echo "   Using PM2..."
    pm2 restart strapi-cms || pm2 start npm --name "strapi-cms" -- start
    echo "   ✅ Strapi restarted with PM2"
else
    echo "   ⚠️  PM2 not found"
    echo "   Please restart Strapi manually in Plesk Node.js app settings"
    echo "   Or run: NODE_ENV=production npm start"
fi
echo ""

# Wait for Strapi to start
echo "   ⏳ Waiting for Strapi to start (30 seconds)..."
sleep 30
echo ""

# ============================================
# STEP 5: Import Content
# ============================================
echo "📥 Step 5/5: Importing content..."
echo "────────────────────────────────────────────────────────────"

# Check if API token is set
if [ -z "$STRAPI_API_TOKEN" ]; then
    echo ""
    echo "⚠️  WARNING: STRAPI_API_TOKEN not set!"
    echo ""
    echo "📝 To import content, you need an API token from Strapi:"
    echo ""
    echo "   1. Open Strapi admin: https://cms.envicon.nl/admin"
    echo "   2. Go to Settings → API Tokens"
    echo "   3. Click 'Create new API Token'"
    echo "   4. Name: Content Import"
    echo "   5. Token type: Full access"
    echo "   6. Duration: Unlimited"
    echo "   7. Copy the token and run:"
    echo ""
    echo "      STRAPI_API_TOKEN=your_token_here npm run import-content"
    echo ""
    echo "✅ Setup complete (except content import)"
else
    echo "   API Token found, importing content..."
    npm run import-content
    
    if [ $? -eq 0 ]; then
        echo "   ✅ Content imported successfully"
    else
        echo "   ❌ Content import failed (see errors above)"
        echo "   You can retry with: STRAPI_API_TOKEN=$STRAPI_API_TOKEN npm run import-content"
    fi
fi
echo ""

# ============================================
# FINAL SUMMARY
# ============================================
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    SETUP COMPLETE! ✨                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 What was done:"
echo "   ✅ Dependencies installed"
echo "   ✅ Build artifacts cleaned"
echo "   ✅ Strapi built successfully"
echo "   ✅ Strapi restarted"

if [ -z "$STRAPI_API_TOKEN" ]; then
    echo "   ⏳ Content import pending (needs API token)"
else
    echo "   ✅ Content imported"
fi

echo ""
echo "🌐 Your Strapi CMS:"
echo "   Admin: https://cms.envicon.nl/admin"
echo "   API:   https://cms.envicon.nl/api"
echo ""
echo "📝 Next steps:"

if [ -z "$STRAPI_API_TOKEN" ]; then
    echo "   1. Get API token from Strapi admin"
    echo "   2. Run: STRAPI_API_TOKEN=token npm run import-content"
    echo "   3. Check imported content in admin panel"
    echo "   4. Add images to content entries"
    echo "   5. Publish all content"
else
    echo "   1. Open Strapi admin panel"
    echo "   2. Verify imported content"
    echo "   3. Add images to content entries"
    echo "   4. Publish all content (if in draft mode)"
    echo "   5. Test pages on your website"
fi

echo ""
echo "🎉 All done!"
echo ""

