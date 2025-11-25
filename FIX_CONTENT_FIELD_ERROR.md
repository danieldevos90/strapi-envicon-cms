# Fix Content Field Error

## The Problem

The `content` field (RichText) is causing 500 errors when creating articles.

## Possible Causes

1. **RichText format issue** - Content might need to be in a specific format
2. **RichText validation** - Strapi might be validating content and failing
3. **Database column issue** - Content column might have constraints
4. **RichText configuration** - Field might need additional configuration

## Solutions

### Solution 1: Make Content Optional Temporarily

To test if content is the issue, temporarily make it optional:

**Edit `src/api/article/content-types/article/schema.json`:**
```json
"content": {
  "type": "richtext",
  "required": false  // Change from true to false
}
```

Then rebuild and test.

### Solution 2: Check Content Format

RichText in Strapi v5 might need to be in a specific format. Test different formats:

1. **Plain string:** `"content": "Plain text"`
2. **HTML string:** `"content": "<p>HTML content</p>"`
3. **RichText object:** `"content": { "type": "doc", "content": [...] }`

### Solution 3: Check Database Column

Verify the content column exists and allows the data:

```sql
SHOW COLUMNS FROM articles WHERE Field = 'content';
```

Check:
- Type should be `LONGTEXT` or `TEXT`
- Should allow NULL if making it optional

### Solution 4: Simplify RichText Configuration

Try adding configuration to the RichText field:

```json
"content": {
  "type": "richtext",
  "required": true,
  "pluginOptions": {}
}
```

## Test Script

Use the test script to try different content formats:

```bash
npm run test:content YOUR_TOKEN
```

This will test:
- Without content (should fail if required)
- Plain text content
- Simple HTML content
- RichText format content

## Most Likely Fix

**Make content optional temporarily** to test:

1. Change `required: true` to `required: false` in schema
2. Rebuild: `npm run build`
3. Restart Strapi
4. Test article creation without content
5. If it works, the issue is with RichText validation/format
6. Then fix the RichText configuration

## After Testing

Once you identify the issue:
- If plain text works → RichText format issue
- If HTML works → RichText validation issue
- If nothing works → Database or other issue

