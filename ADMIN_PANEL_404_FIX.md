# Fix Admin Panel 404 for api::article.article

## Current Issue

Admin panel shows:
```
Failed to load resource: the server responded with a status of 404 () (api::article.article, line 0)
```

This suggests the content type isn't properly registered in the admin panel.

## Possible Causes

1. **Content type not registered** - Strapi doesn't recognize the article content type
2. **Build issue** - Admin panel wasn't rebuilt properly
3. **Schema issue** - Schema file has an error preventing registration

## Solutions

### Solution 1: Rebuild Admin Panel

The admin panel needs to be rebuilt to recognize content types:

```bash
cd strapi-cms
npm run build
```

Then restart Strapi.

### Solution 2: Check Schema File

Verify the schema file is valid JSON and properly formatted:

```bash
# Check if schema is valid JSON
cat src/api/article/content-types/article/schema.json | python3 -m json.tool
```

If it errors, the schema has a syntax error.

### Solution 3: Verify Content Type Structure

Make sure the content type structure is correct:

```
strapi-cms/
  src/
    api/
      article/
        content-types/
          article/
            schema.json  ← Must exist
        controllers/
          article.js
        routes/
          article.js
        services/
          article.js
```

### Solution 4: Clear Everything and Rebuild

```bash
cd strapi-cms
rm -rf .cache build dist node_modules/.cache
npm run build
# Restart Strapi
```

### Solution 5: Check Strapi Index

Verify the content type is exported in the main index:

Check if `src/index.ts` or similar file exports the content types properly.

## Quick Test

After rebuild, check if admin panel can access the content type:

1. Go to `https://cms.envicon.nl/admin`
2. Click **Content-Type Builder**
3. Look for **Article** in the list
4. If it's missing → Content type not registered
5. If it's there → Click on it to see if it loads

## Most Likely Fix

**Rebuild Strapi admin panel:**

```bash
cd strapi-cms
npm run build
```

Then restart Strapi. The admin panel needs to be rebuilt to recognize content types.

