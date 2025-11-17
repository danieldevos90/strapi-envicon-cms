# Remove publishedAt from Schema

## The Issue

With `draftAndPublish: true` enabled, Strapi **automatically manages** the `publishedAt` field. You should **NOT** define it in the schema manually.

## Why Remove It

When `draftAndPublish: true` is set:
- ✅ Strapi automatically creates `publishedAt` field
- ✅ Strapi automatically sets it when you publish
- ✅ Strapi automatically clears it when you unpublish
- ❌ Defining it manually in schema can cause conflicts

## The Fix

**Removed `publishedAt` from schema** - Strapi will handle it automatically.

## After Removing from Schema

1. **Rebuild Strapi:**
   ```bash
   cd strapi-cms
   npm run build
   ```

2. **Restart Strapi** (via Plesk)

3. **Test article creation:**
   ```bash
   ./test-article-simple.sh
   ```

## How It Works Now

- **Creating draft:** `publishedAt` is automatically NULL
- **Publishing:** Strapi automatically sets `publishedAt` to current date/time
- **Unpublishing:** Strapi automatically sets `publishedAt` back to NULL
- **No manual control needed:** Strapi handles everything

## Database Column

The database column `publishedAt` should still exist (we created it), but Strapi will manage it automatically. You don't need to define it in the schema.

## Expected Behavior

After rebuild:
- ✅ Article creation should work (HTTP 200)
- ✅ Publishing should work
- ✅ `publishedAt` is managed automatically by Strapi
- ✅ No more 500 errors

