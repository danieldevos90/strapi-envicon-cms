# Check if Strapi Rebuild is Needed

## Current Status

- ❌ Article creation: HTTP 500
- ❌ Article reading: Failing
- ✅ Schema file: Updated correctly (`publishedAt` is `required: false`)

## The Problem

The schema file has been updated, but Strapi is still returning 500 errors. This means:

**Strapi has NOT been rebuilt yet** - The changes in the schema file won't take effect until Strapi is rebuilt.

## How to Verify Rebuild Status

### Check 1: Admin Panel Schema

1. Go to `https://cms.envicon.nl/admin`
2. Navigate to **Content-Type Builder** → **Article**
3. Check the `publishedAt` field:
   - If it shows as **Required** → Rebuild needed ❌
   - If it shows as **Optional** → Already rebuilt ✅

### Check 2: Build Directory

Check if build directory exists and is recent:

```bash
ls -la strapi-cms/build
# or
ls -la strapi-cms/dist
```

If missing or old → Rebuild needed

### Check 3: Test API

After rebuild, test should work:

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Test",
      "slug": "test",
      "excerpt": "Test",
      "content": "<p>Test</p>"
    }
  }' \
  https://cms.envicon.nl/api/articles
```

**Expected:** HTTP 200 (article created)
**Current:** HTTP 500 (needs rebuild)

## Required Actions

### Step 1: Rebuild Strapi

```bash
cd strapi-cms
npm run build
```

This will:
- Regenerate admin panel
- Update API routes
- Apply schema changes

### Step 2: Restart Strapi

**Via Plesk:**
1. Log into Plesk
2. Go to **Domains** → **cms.envicon.nl** → **Node.js**
3. Click **Restart App**

### Step 3: Verify

After rebuild and restart:
- Admin panel should show `publishedAt` as optional
- Article creation should work (HTTP 200)
- Publishing should work

## Why Rebuild is Critical

Schema changes in Strapi require:
1. **Code generation** - Admin panel UI needs regeneration
2. **API updates** - Routes need to reflect new schema
3. **Validation** - Rules need to be updated
4. **Database** - Structure may need migration

Without rebuild, Strapi uses the old schema, causing validation errors.

## Current Schema (Correct)

```json
"publishedAt": {
  "type": "datetime",
  "required": false  // ✅ Correct - allows drafts
}
```

This is correct, but Strapi needs rebuild to use it.

