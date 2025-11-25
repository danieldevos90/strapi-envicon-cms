# Fix JSON to RichText Migration

## The Problem

You changed the content field from `json` type to `richtext` type, but the database column is still JSON type, causing internal errors.

## The Issue

When you change a field type in Strapi schema:
- **Schema says**: `richtext` (expects HTML/text)
- **Database says**: `JSON` (stores JSON objects)
- **Result**: Mismatch causes errors

## Solution: Migrate Database Column

### Step 1: Check Current Column Type

Run this SQL:
```sql
SHOW COLUMNS FROM articles WHERE Field = 'content';
```

### Step 2: Convert JSON Column to LONGTEXT

If the column is `JSON` type, convert it to `LONGTEXT`:

```sql
-- Convert JSON column to LONGTEXT for RichText
ALTER TABLE articles MODIFY content LONGTEXT NULL;
```

### Step 3: Handle Existing Data (if needed)

If you have existing JSON data that needs to be converted:

```sql
-- Option A: Clear existing JSON data (if not needed)
UPDATE articles SET content = NULL WHERE content IS NOT NULL;

-- Option B: Convert JSON to HTML string (if you want to preserve content)
-- This depends on your JSON structure - you may need custom conversion
```

### Step 4: Rebuild Strapi

```bash
cd strapi-cms
npm run build
```

### Step 5: Restart Strapi

Restart via Plesk.

## Why This Happens

- **JSON field**: Stores structured data as JSON objects
- **RichText field**: Stores HTML/text content as strings
- **Database mismatch**: Column type must match field type

## After Migration

1. Content field will accept HTML/text content
2. RichText editor will work properly
3. No more internal errors when typing content

## Verify

After migration, check:
```sql
SHOW COLUMNS FROM articles WHERE Field = 'content';
```

Should show: `Type: longtext`

Then test creating an article with RichText content.

