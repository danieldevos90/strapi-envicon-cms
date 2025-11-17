# Fix Missing publishedAt Column

## The Problem

The database error shows:
```
Unknown column 'publishedAt' in 'articles'
```

This means the `publishedAt` column **doesn't exist** in the database table, even though it's defined in the schema.

## Why This Happens

When `draftAndPublish: true` is enabled in Strapi, Strapi should automatically create the `publishedAt` column. If it doesn't exist, it means:

1. **Migration didn't run** - Strapi migrations haven't created the column
2. **Table was created before draftAndPublish** - Table existed before enabling draft/publish
3. **Manual table creation** - Table was created manually without the column

## Solution: Create the Column

### Step 1: Check Current Table Structure

First, see what columns exist:

```sql
SHOW COLUMNS FROM articles;
```

Or:

```sql
DESCRIBE articles;
```

### Step 2: Create the Column

Add the `publishedAt` column:

```sql
ALTER TABLE articles ADD COLUMN publishedAt DATETIME NULL;
```

### Step 3: Verify

Check that it was created:

```sql
SHOW COLUMNS FROM articles WHERE Field = 'publishedAt';
```

Should show:
- Field: `publishedAt`
- Type: `datetime`
- Null: `YES` (allows NULL for drafts)

## Via phpMyAdmin

1. Log into Plesk → **Databases** → **phpMyAdmin**
2. Select your Strapi database
3. Click on `articles` table
4. Click **Structure** tab
5. Scroll down and click **Add** (at bottom)
6. Fill in:
   - **Name**: `publishedAt`
   - **Type**: `DATETIME`
   - **Null**: Check the checkbox (allows NULL)
7. Click **Save**

## After Creating Column

1. **Restart Strapi** (so it recognizes the new column)
2. **Test article creation**:
   ```bash
   ./test-article-simple.sh
   ```

Should now work! ✅

## Alternative: Let Strapi Create It

If you prefer Strapi to handle it:

1. **Temporarily remove** `publishedAt` from schema
2. **Rebuild Strapi**: `npm run build`
3. **Restart Strapi**
4. **Add back** `publishedAt` to schema with `required: false`
5. **Rebuild again**: `npm run build`
6. **Restart Strapi**

Strapi should create the column automatically.

## Summary

The column is missing from the database. Create it manually:

```sql
ALTER TABLE articles ADD COLUMN publishedAt DATETIME NULL;
```

Then restart Strapi and test again.

