# Clean Cache and Rebuild - npm Scripts Available

## Available npm Scripts

You have these npm scripts available for cleaning and rebuilding:

### 1. Clear Cache Only
```bash
npm run clear:cache
```
This runs `clear-cache-rebuild.js` which clears the cache.

### 2. Fresh Build (Recommended)
```bash
npm run fresh:build
```
This does:
1. Clears cache (`clear-cache-rebuild.js`)
2. Builds Strapi (`npm run build`)
3. Restarts Strapi (`npm run restart`)

**This is the easiest way to clean and rebuild!**

## Usage

Since you're on Plesk and can only use npm:

```bash
cd strapi-cms
npm run fresh:build
```

This will:
- ✅ Clear all cache
- ✅ Rebuild Strapi
- ✅ Restart Strapi

All in one command!

## After Running

After `npm run fresh:build` completes:

1. **Test article creation:**
   ```bash
   ./test-article-simple.sh
   ```

2. **Or test manually:**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "data": {
         "title": "Test Article",
         "slug": "test-article",
         "excerpt": "Test excerpt",
         "content": "<p>Test</p>"
       }
     }' \
     https://cms.envicon.nl/api/articles
   ```

Should return HTTP 200 ✅

## What It Does

The `fresh:build` script:
1. Removes `.cache` directory
2. Removes `build` directory  
3. Removes `dist` directory
4. Runs `npm run build` to rebuild
5. Runs `npm run restart` to restart

This ensures Strapi recognizes the new `publishedAt` column in the database.

## Quick Reference

```bash
# Clean cache only
npm run clear:cache

# Clean, build, and restart (recommended)
npm run fresh:build

# Just build
npm run build

# Just restart
npm run restart
```

