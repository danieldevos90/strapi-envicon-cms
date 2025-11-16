# Still Getting 500 After Creating Column

## Current Status

- ✅ Column created: `publishedAt` added to database
- ✅ Strapi restarted: Node.js app restarted
- ❌ Article creation: Still HTTP 500

## Next Steps to Debug

### 1. Verify Column Was Created Correctly

Run this SQL to check:

```sql
SHOW COLUMNS FROM articles WHERE Field = 'publishedAt';
```

**Should show:**
- Field: `publishedAt`
- Type: `datetime`
- **Null: YES** ← This is critical!
- Default: `NULL`

**If Null shows 'NO':**
```sql
ALTER TABLE articles MODIFY publishedAt DATETIME NULL;
```

### 2. Check Strapi Application Logs

The logs will show the exact error. Check:

**Via Plesk:**
- **Domains** → **cms.envicon.nl** → **Node.js** → **View Logs**
- Look for errors when creating articles
- Copy the exact error message

**Common errors you might see:**

1. **Column type mismatch:**
   ```
   Error: Column type mismatch
   ```
   → Column might be wrong type

2. **Still validation error:**
   ```
   publishedAt is required
   ```
   → Strapi cache issue, need to clear cache

3. **Database connection:**
   ```
   Connection error
   ```
   → Database connection issue

### 3. Clear Strapi Cache

Sometimes Strapi caches the old schema:

```bash
cd strapi-cms
rm -rf .cache
npm run build
# Restart Strapi
```

### 4. Check Column Name

Make sure the column name matches exactly. Strapi might be case-sensitive:

```sql
-- Check exact column name
SHOW COLUMNS FROM articles;
```

Look for `publishedAt` (exact case).

### 5. Test via Admin Panel

Try creating an article directly in admin:

1. Go to `https://cms.envicon.nl/admin`
2. **Content Manager** → **Articles** → **Create new entry**
3. Fill in required fields
4. Leave `publishedAt` empty
5. Click **Save**

**If it works in admin but not API:**
- API authentication issue
- API validation different from admin

**If it fails in admin too:**
- Check error message shown in admin panel
- This will tell you exactly what's wrong

### 6. Check Database Table Structure

Get full table structure:

```sql
DESCRIBE articles;
```

Or:

```sql
SHOW CREATE TABLE articles;
```

Look for:
- All required columns exist
- Column types match schema
- NULL constraints are correct

## Most Likely Issues

### Issue 1: Column Allows NULL But Strapi Still Validates

**Symptom:** Column is NULL but Strapi still requires it
**Fix:** Clear cache and rebuild:
```bash
rm -rf .cache build dist
npm run build
# Restart Strapi
```

### Issue 2: Column Type Mismatch

**Symptom:** Column exists but wrong type
**Fix:** Check column type matches schema (should be DATETIME)

### Issue 3: Strapi Not Recognizing Column

**Symptom:** Column exists but Strapi doesn't see it
**Fix:** Restart Strapi again, or check database connection

## Critical: Check Strapi Logs

**The logs will show the exact error.** Without seeing the actual error message, we're guessing. 

Check Plesk Node.js logs for the exact error when you try to create an article.

## Quick Test

Try this minimal test:

```sql
-- Insert test record directly (bypass Strapi)
INSERT INTO articles (title, slug, excerpt, content, createdAt, updatedAt)
VALUES ('Test', 'test', 'Test excerpt', '<p>Test</p>', NOW(), NOW());
```

If this works, the database is fine and it's a Strapi issue.
If this fails, there's a database constraint issue.

