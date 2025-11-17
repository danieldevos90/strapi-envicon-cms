# Fix for Article Publish 500 Error

## Root Cause Identified

The article schema has `publishedAt` marked as `required: true`, but when using Strapi's `draftAndPublish` feature, `publishedAt` should be optional (null for drafts, set automatically on publish).

## The Problem

```json
"publishedAt": {
  "type": "date",
  "required": true  // ❌ This is wrong!
}
```

When creating a draft article, `publishedAt` is null, but the schema requires it, causing a 500 error.

## The Fix

Change `publishedAt` from `required: true` to `required: false`:

```json
"publishedAt": {
  "type": "date",
  "required": false  // ✅ Correct!
}
```

## Steps to Fix

1. **Update the schema file:**
   - File: `strapi-cms/src/api/article/content-types/article/schema.json`
   - Change line 34: `"required": true` → `"required": false`

2. **Rebuild Strapi:**
   ```bash
   cd strapi-cms
   npm run build
   ```

3. **Restart Strapi:**
   - Via Plesk: Restart Node.js app
   - Or: `npm run restart`

4. **Test:**
   - Try creating a new article in Strapi admin
   - Try publishing an article
   - Both should work now!

## Why This Happens

- Strapi's `draftAndPublish` feature allows articles to exist as drafts (without `publishedAt`)
- When you publish, Strapi automatically sets `publishedAt` to the current date/time
- If `publishedAt` is required, Strapi can't create drafts, causing 500 errors

## Verification

After the fix, test with curl:

```bash
# Create draft (should work)
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

# Publish (should work)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://cms.envicon.nl/api/articles/ARTICLE_ID/actions/publish
```

Both should return 200 OK instead of 500.

