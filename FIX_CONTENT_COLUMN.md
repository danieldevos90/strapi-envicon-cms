# Fix Content Column for RichText

## The Problem

Internal error when typing in RichText content field - likely database column type issue.

## Quick Fix

Run this SQL in your database:

```sql
-- Check current column type
SHOW COLUMNS FROM articles WHERE Field = 'content';

-- Fix: Change to LONGTEXT (allows large RichText content)
ALTER TABLE articles MODIFY content LONGTEXT NULL;

-- Verify
SHOW COLUMNS FROM articles WHERE Field = 'content';
```

## Why This Fixes It

RichText content can be very large (especially with formatting, images, etc.). If the column is:
- `TEXT` - Limited to ~65KB
- `VARCHAR` - Even smaller limit
- `LONGTEXT` - Can handle up to 4GB ✅

## After Running SQL

1. **Rebuild Strapi:**
   ```bash
   npm run build
   ```

2. **Restart Strapi** (via Plesk)

3. **Test** - Try typing content in the RichText field again

## If Still Failing

1. Check Strapi logs for exact error
2. Test different content formats:
   ```bash
   npm run test:richtext YOUR_TOKEN
   ```
3. Try making content optional temporarily to publish articles

## Expected Result

After changing column to `LONGTEXT`, RichText content should save without errors.

