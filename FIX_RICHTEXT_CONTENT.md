# Fix RichText Content Field Error

## The Problem

The `content` field (RichText type) is causing 500 errors when creating articles.

## Temporary Fix: Make Content Optional

I've temporarily made the content field optional (`required: false`) so you can:
1. Test article creation without content
2. Verify other fields work
3. Then fix the RichText issue separately

## Next Steps

### Step 1: Rebuild Strapi

```bash
cd strapi-cms
npm run build
```

Then restart Strapi.

### Step 2: Test Article Creation

```bash
npm run test:article:logs YOUR_TOKEN
```

Or test without content:
```bash
npm run test:content YOUR_TOKEN
```

### Step 3: If It Works Without Content

If article creation works without content, the issue is with RichText. Possible fixes:

#### Fix A: Use Correct RichText Format

In Strapi v5, RichText might need to be sent as HTML string, not RichText object:

```javascript
// Try this format:
{
  "data": {
    "title": "Test",
    "slug": "test",
    "excerpt": "Test",
    "content": "<p>Test content</p>"  // Simple HTML string
  }
}
```

#### Fix B: Check RichText Configuration

The RichText field might need additional configuration. Check if there are any RichText-specific settings in Strapi admin.

#### Fix C: Database Column Issue

Check if the content column exists and is the right type:

```sql
SHOW COLUMNS FROM articles WHERE Field = 'content';
```

Should be `LONGTEXT` or `TEXT` type.

### Step 4: Make Content Required Again

Once RichText is fixed, change back to `required: true`:

```json
"content": {
  "type": "richtext",
  "required": true
}
```

Then rebuild.

## Testing Different Content Formats

Use the test script to try different formats:

```bash
npm run test:content YOUR_TOKEN
```

This tests:
- Plain text
- HTML string
- RichText object format

## Common RichText Issues

1. **Format mismatch** - Sending wrong format
2. **Validation error** - Content doesn't pass validation
3. **Database constraint** - Column type or size issue
4. **XSS protection** - Content blocked by security

## After Rebuild

Test article creation - it should work now (without content). Then we can fix RichText separately.

