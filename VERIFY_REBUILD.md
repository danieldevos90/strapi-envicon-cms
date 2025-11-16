# Verify Strapi Rebuild After Schema Changes

## Current Issue

Article API still returns 500 errors after schema changes. This suggests Strapi hasn't been rebuilt yet.

## Schema Changes Made

1. Changed `publishedAt` from `required: true` to `required: false`
2. Changed `publishedAt` type from `date` to `datetime`

## Required Steps

### 1. Rebuild Strapi

```bash
cd strapi-cms
npm run build
```

This will:
- Regenerate admin panel with updated schema
- Update API routes
- Apply schema changes to database structure

### 2. Restart Strapi

**Via Plesk:**
1. Log into Plesk
2. Go to **Domains** → **cms.envicon.nl** → **Node.js**
3. Click **Restart App**

**Or via command line (if SSH access):**
```bash
cd strapi-cms
npm run restart
```

### 3. Verify Rebuild

After rebuild and restart, test:

```bash
# Test article creation
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

Should return **200 OK** instead of **500**.

## Why Rebuild is Needed

When you change the schema:
- Strapi needs to regenerate the admin panel UI
- API routes need to be updated
- Database structure may need migration
- Validation rules need to be updated

Without rebuild, Strapi still uses the old schema, causing validation errors.

## Check if Rebuild is Needed

If you see:
- ❌ 500 errors when creating articles
- ❌ Admin panel shows old field configuration
- ❌ Validation errors for `publishedAt`

Then rebuild is required.

## After Rebuild

✅ Article creation should work
✅ Publishing should work  
✅ No more 500 errors
✅ `publishedAt` field is optional (allows drafts)

