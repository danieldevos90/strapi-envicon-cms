# Clear Cache and Rebuild After Database Changes

## Current Status

✅ Database column is correct:
- `publishedAt` exists
- Type: `datetime`
- Null: `YES` (allows NULL)
- Default: `NULL`

❌ Article creation still fails with 500

## The Issue

Even though the database column is correct, Strapi may have cached the old schema or needs to recognize the new column structure.

## Solution: Clear Cache and Rebuild

### Step 1: Clear Strapi Cache

```bash
cd strapi-cms
rm -rf .cache
rm -rf build
rm -rf dist
```

### Step 2: Rebuild Strapi

```bash
npm run build
```

### Step 3: Restart Strapi

**Via Plesk:**
1. Go to **Domains** → **cms.envicon.nl** → **Node.js**
2. Click **Restart App**
3. Wait for restart to complete

### Step 4: Test Again

```bash
./test-article-simple.sh
```

## Why This Is Needed

When you add a database column manually:
- ✅ Database structure is updated
- ❌ Strapi cache may still have old structure
- ❌ Strapi build may need regeneration
- ❌ Strapi needs restart to recognize changes

Clearing cache and rebuilding ensures Strapi recognizes the new column.

## Alternative: Check Strapi Logs First

Before clearing cache, check Strapi logs to see the exact error:

**Via Plesk:**
- **Domains** → **cms.envicon.nl** → **Node.js** → **View Logs**

The error message will tell you if it's:
- Cache issue → Clear cache
- Validation issue → Check schema
- Database issue → Check connection
- Other issue → Fix accordingly

## Quick Test After Rebuild

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

