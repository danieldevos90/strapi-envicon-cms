#!/bin/bash

# Fix Strapi Upload Plugin on Plesk
# This script fixes common upload issues

echo "🔧 Fixing Strapi Upload Plugin on Plesk..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p public/uploads

# Fix permissions
echo "🔒 Setting permissions..."
chmod -R 755 public/
chmod -R 777 public/uploads

# Try to detect the user (common Plesk users)
if [ -n "$USER" ]; then
    echo "👤 Setting ownership to $USER..."
    chown -R "$USER:psacln" public/uploads 2>/dev/null || \
    chown -R "$USER:$USER" public/uploads 2>/dev/null || \
    echo "⚠️  Could not set ownership automatically. Please run manually:"
    echo "   chown -R your-user:psacln public/uploads"
fi

echo ""
echo "✅ Upload directory fixed!"
echo "📁 Location: $(pwd)/public/uploads"
echo "🔒 Permissions: $(ls -ld public/uploads | awk '{print $1}')"
echo ""
echo "📝 Next steps:"
echo "1. Rebuild Strapi: npm run build"
echo "2. Restart Strapi: pm2 restart strapi-cms"
echo "3. Configure nginx upload limits in Plesk (see FIX_UPLOAD_PLESK.md)"
echo ""

