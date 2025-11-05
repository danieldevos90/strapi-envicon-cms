# Complete CMS Setup Guide

This guide will help you clean up duplicates, upload media, and test the production CMS.

## Prerequisites

1. **Get your Strapi API Token** from the production CMS
2. **Ensure Node.js dependencies are installed**

## Step-by-Step Instructions

### 1. Get Your API Token

Visit https://cms.envicon.nl/admin and:
1. Go to **Settings** → **API Tokens**
2. Create a new token or use an existing one
3. Copy the token value

### 2. Set Environment Variables

```bash
# In the strapi-cms directory
export STRAPI_API_TOKEN='your-token-here'
export STRAPI_URL='https://cms.envicon.nl'
```

### 3. Run the Complete Setup

The easiest way is to run the master script:

```bash
cd strapi-cms
chmod +x complete-setup.sh
./complete-setup.sh
```

This will automatically:
- ✅ Clean up duplicate entries
- ✅ Upload all media files
- ✅ Link media to content items

### 4. Manual Steps (Alternative)

If you prefer to run each step separately:

#### 4a. Clean Up Duplicates

```bash
cd strapi-cms
node cleanup-duplicates.js
```

This removes duplicate entries from:
- Solutions
- Sectors
- Services
- Process Steps

#### 4b. Upload Media Files

```bash
node upload-media.js
```

This uploads:
- Solution icons (SVG files)
- Solution images
- Article featured images
- Brochures
- Hero carousel images

The script saves upload results to `uploaded-media.json`.

#### 4c. Link Media to Content

```bash
node link-media.js
```

This links:
- Icons and images to Solutions
- Featured images to Articles
- Brochures to Sectors

### 5. Test Frontend Integration

From the project root:

```bash
node test-production-cms.js
```

This will:
- Test all API endpoints
- Verify data is being fetched correctly
- Check that media files are linked
- Show a summary of available content

### 6. Test the Website

```bash
# Set the production CMS URL in your environment
export NEXT_PUBLIC_STRAPI_URL='https://cms.envicon.nl'

# Run the development server
npm run dev
```

Visit http://localhost:3000 and verify:
- ✅ Content loads correctly
- ✅ Images are displayed
- ✅ Navigation works
- ✅ Forms are configured

## Troubleshooting

### "STRAPI_API_TOKEN is not set"

Make sure you exported the token:
```bash
export STRAPI_API_TOKEN='your-token-here'
```

### "File not found" errors

The upload script looks for files in the `public` directory. Ensure all files exist:
- `public/eDEMONTABEL 1.svg`
- `public/eOVERKAPPINGEN 1.svg`
- `public/eMODULAIRE 1.svg`
- `public/eLOODSEN 1.svg`
- `public/Loods.png`
- `public/Overkapping.jpg`
- `public/modulaire-unit.jpg`
- `public/sport-hall.png`
- `public/images/WhatsApp Image 2025-06-27 at 10.35.19.jpeg`
- `public/images/WhatsApp Image 2025-07-23 at 16.46.32.jpeg`
- `public/images/WhatsApp Image 2025-08-05 at 09.18.16.jpeg`
- `public/brochures/Envicon-onepage-2025.pdf`

### "Failed to upload" errors

1. Check that the API token has upload permissions
2. Verify the file paths are correct
3. Ensure the CMS URL is correct
4. Check file size limits in Strapi settings

### Duplicates still showing

If duplicates persist:
1. Check the Strapi admin panel manually
2. Look for entries with different `documentId` but same `title`
3. Delete manually or adjust the cleanup script

## Production Deployment

Once everything is tested locally:

1. **Update production environment variables:**
   ```bash
   NEXT_PUBLIC_STRAPI_URL=https://cms.envicon.nl
   ```

2. **Deploy your Next.js app**

3. **Verify the production site:**
   - Check all pages load correctly
   - Verify images are displayed
   - Test forms submit correctly
   - Check SEO metadata

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `cleanup-duplicates.js` | Remove duplicate entries from collections |
| `upload-media.js` | Upload media files to Strapi |
| `link-media.js` | Link uploaded media to content items |
| `complete-setup.sh` | Run all scripts in sequence |
| `test-production-cms.js` | Test frontend integration |

## Next Steps

After completing this setup:

1. ✅ Review content in Strapi admin
2. ✅ Add any missing images or content
3. ✅ Test all website pages
4. ✅ Configure production environment
5. ✅ Deploy to production

---

**Need Help?** Check the logs from each script for detailed error messages.

