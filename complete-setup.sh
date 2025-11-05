#!/bin/bash

# Complete CMS Setup Script
# This script will:
# 1. Clean up duplicate entries
# 2. Upload media files
# 3. Link media to content items

set -e  # Exit on error

echo "======================================================================"
echo "🚀 Complete Strapi CMS Setup"
echo "======================================================================"
echo ""

# Check if STRAPI_API_TOKEN is set
if [ -z "$STRAPI_API_TOKEN" ]; then
    echo "❌ Error: STRAPI_API_TOKEN environment variable is not set"
    echo ""
    echo "Please set your API token:"
    echo "export STRAPI_API_TOKEN='your-token-here'"
    echo ""
    exit 1
fi

# Set default STRAPI_URL if not provided
export STRAPI_URL="${STRAPI_URL:-https://cms.envicon.nl}"

echo "🌐 Using Strapi URL: $STRAPI_URL"
echo ""

# Step 1: Clean up duplicates
echo "======================================================================"
echo "Step 1: Cleaning up duplicate entries"
echo "======================================================================"
node cleanup-duplicates.js
if [ $? -ne 0 ]; then
    echo "⚠️  Warning: Cleanup had some issues, but continuing..."
fi
echo ""

# Wait a bit to let the API settle
sleep 2

# Step 2: Upload media
echo "======================================================================"
echo "Step 2: Uploading media files"
echo "======================================================================"
node upload-media.js
if [ $? -ne 0 ]; then
    echo "❌ Error: Media upload failed"
    exit 1
fi
echo ""

# Wait a bit to let uploads complete
sleep 2

# Step 3: Link media
echo "======================================================================"
echo "Step 3: Linking media to content items"
echo "======================================================================"
node link-media.js
if [ $? -ne 0 ]; then
    echo "❌ Error: Media linking failed"
    exit 1
fi
echo ""

echo "======================================================================"
echo "✅ Complete! Your CMS is now fully configured"
echo "======================================================================"
echo ""
echo "Next steps:"
echo "  1. Visit $STRAPI_URL/admin to verify"
echo "  2. Test the frontend by running: npm run dev"
echo "  3. Check that images appear correctly"
echo ""

