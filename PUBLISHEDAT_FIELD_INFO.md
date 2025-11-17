# publishedAt Field Configuration

## Current Configuration

The `publishedAt` field is configured in the article schema as:

```json
"publishedAt": {
  "type": "datetime",
  "required": false
}
```

## How It Works

### With `draftAndPublish: true`

When `draftAndPublish` is enabled in the schema options:
- **Draft articles**: `publishedAt` is `null` (not required)
- **Published articles**: `publishedAt` is automatically set to the current date/time when you click "Publish"
- **Field visibility**: The field is automatically visible in the Strapi admin panel

### Field Behavior

1. **Creating a draft**: 
   - `publishedAt` can be left empty/null
   - Article is saved as draft
   - No validation error

2. **Publishing an article**:
   - Strapi automatically sets `publishedAt` to current date/time
   - You don't need to manually set it
   - Article becomes published

3. **Unpublishing an article**:
   - `publishedAt` is set back to `null`
   - Article becomes a draft again

## Schema Configuration

```json
{
  "options": {
    "draftAndPublish": true  // Enables draft/publish workflow
  },
  "attributes": {
    "publishedAt": {
      "type": "datetime",    // Date and time field
      "required": false      // Not mandatory (allows drafts)
    }
  }
}
```

## Important Notes

- ✅ `required: false` is correct - allows drafts without `publishedAt`
- ✅ `type: "datetime"` stores both date and time
- ✅ Field is automatically managed by Strapi when publishing/unpublishing
- ✅ Field is visible in admin panel automatically

## Verification

After rebuilding Strapi, you should see:
- `publishedAt` field in the article edit form
- Field is empty/null for drafts
- Field is automatically filled when publishing
- No validation errors when creating drafts

## Rebuild Required

After any schema changes:
```bash
cd strapi-cms
npm run build
# Restart Strapi
```

