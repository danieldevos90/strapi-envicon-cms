# 🚀 CMS Setup Scripts

Automated scripts to clean, upload, and configure your Strapi CMS.

## Quick Start

```bash
# 1. Get your API token from https://cms.envicon.nl/admin
export STRAPI_API_TOKEN='your-token-here'

# 2. Run the complete setup
./complete-setup.sh
```

## What This Does

✅ Removes duplicate content entries  
✅ Uploads all media files (images, icons, brochures)  
✅ Links media to content items  

**Time:** ~2-5 minutes  
**Result:** Production-ready CMS with all content and media

## Individual Scripts

If you prefer to run steps separately:

```bash
# Clean up duplicates only
node cleanup-duplicates.js

# Upload media only
node upload-media.js

# Link media only
node link-media.js
```

## Testing

Test the integration from project root:

```bash
cd ..
node test-production-cms.js
```

## Documentation

- **SETUP_GUIDE.md** - Complete step-by-step guide
- **../QUICK_START_CMS_SETUP.md** - Fast track instructions
- **../docs/CMS_SETUP_COMPLETE.md** - Detailed overview
- **../docs/CMS_ENDPOINT_TEST_RESULTS.md** - API test results

## Need Help?

Check the troubleshooting section in SETUP_GUIDE.md

---

**Ready?** Just run `./complete-setup.sh`! 🎉





