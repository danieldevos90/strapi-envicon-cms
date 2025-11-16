# Fix RichText Internal Error

## The Problem

When typing content in the RichText field, you get an internal error (500).

## Possible Causes

1. **RichText format validation** - Content format doesn't match what Strapi expects
2. **Database column type** - Content column might be too small or wrong type
3. **XSS sanitization** - Content being blocked by security
4. **RichText configuration** - Field needs additional configuration

## Solutions

### Solution 1: Check Database Column Type

The content column should be `LONGTEXT` to handle large RichText content:

```sql
-- Check current type
SHOW COLUMNS FROM articles WHERE Field = 'content';

-- If it's TEXT or VARCHAR, change to LONGTEXT
ALTER TABLE articles MODIFY content LONGTEXT NULL;
```

### Solution 2: Test Different Content Formats

Run the test script to see which format works:

```bash
npm run test:richtext YOUR_TOKEN
```

This will test:
- Plain string
- HTML string
- RichText JSON format
- Empty content

### Solution 3: Make Content Optional Temporarily

If you need to publish articles immediately:

1. Change `required: true` to `required: false` in schema
2. Rebuild: `npm run build`
3. Restart Strapi
4. Publish articles without content
5. Fix RichText format issue separately

### Solution 4: Check Strapi Logs

Get the exact error from Strapi logs:

```bash
# In Plesk, check:
# - passenger.log
# - Strapi application logs
# - Apache error logs
```

Look for errors mentioning:
- `content`
- `richtext`
- `validation`
- `sanitize`

### Solution 5: RichText Configuration

Try adding configuration to the RichText field:

```json
"content": {
  "type": "richtext",
  "required": true,
  "pluginOptions": {}
}
```

## Most Likely Fix

**Database column type issue** - Change content column to `LONGTEXT`:

```sql
ALTER TABLE articles MODIFY content LONGTEXT NULL;
```

Then rebuild and restart Strapi.

## Testing

After applying fixes:

1. Rebuild: `npm run build`
2. Restart Strapi
3. Try creating an article with content
4. Check which format works (HTML string vs RichText JSON)

## If Still Failing

1. Check exact error in logs
2. Try making content optional temporarily
3. Test different content formats
4. Check if there are custom validators or lifecycle hooks interfering

