#!/bin/bash

# Script to restart Strapi and clear cache after schema changes
# Run this on the Plesk server after deploying schema updates

echo "🔄 Restarting Strapi to apply schema changes..."
echo ""

# Navigate to Strapi directory (adjust path as needed)
cd "$(dirname "$0")" || exit

echo "1️⃣ Clearing Strapi cache..."
rm -rf .cache
rm -rf build
echo "   ✅ Cache cleared"
echo ""

echo "2️⃣ Rebuilding Strapi admin panel..."
npm run strapi build -- --no-optimization
echo "   ✅ Build complete"
echo ""

echo "3️⃣ Restarting Strapi..."
# If using PM2
if command -v pm2 &> /dev/null; then
    echo "   Using PM2..."
    pm2 restart strapi || pm2 start npm --name strapi -- run strapi start
else
    # If using npm directly
    echo "   Using npm..."
    pkill -f "strapi" || true
    npm run strapi start &
fi

echo ""
echo "✅ Strapi restart complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Wait 30-60 seconds for Strapi to fully start"
echo "   2. Log into Strapi Admin: https://cms.envicon.nl/admin"
echo "   3. Check Content-Type Builder → Components → UI → Feature"
echo "   4. Verify icon field is now 'Text' type (not 'Enumeration')"
echo ""

