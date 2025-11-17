# Final Troubleshooting - 500 Error After Rebuild

## Current Status

- ✅ Admin Panel: Working (HTTP 200)
- ✅ Strapi: Running
- ✅ Schema File: Correct (`publishedAt` is optional)
- ❌ Article Creation: HTTP 500 (still failing)

## The Issue

Even after rebuild, article creation fails. This suggests:

1. **Database migration needed** - Database structure may not match schema
2. **Strapi needs restart** - Rebuild creates files, but restart loads them
3. **Database constraint** - Database may still have NOT NULL constraint on `publishedAt`

## Critical Next Steps

### 1. Check Strapi Server Logs

**This is the most important step** - The logs will show the exact error:

**Via Plesk:**
1. Log into Plesk
2. Go to **Logs** → **Error Log**
3. Look for errors when creating articles
4. Copy the exact error message

**Or via SSH:**
```bash
tail -f strapi-cms/logs/*.log
```

The error will tell you exactly what's wrong.

### 2. Verify Database Structure

The database may still have `publishedAt` as NOT NULL:

**Check database:**
```sql
-- Check if publishedAt column allows NULL
DESCRIBE articles;
-- or
SHOW CREATE TABLE articles;
```

If `publishedAt` is NOT NULL, you need to alter the table:
```sql
ALTER TABLE articles MODIFY publishedAt DATETIME NULL;
```

### 3. Restart Strapi

Even if you rebuilt, make sure Strapi restarted:

**Via Plesk:**
1. **Domains** → **cms.envicon.nl** → **Node.js**
2. Click **Restart App**
3. Wait for restart to complete
4. Test again

### 4. Test via Admin Panel

Try creating an article directly in the admin panel:

1. Go to `https://cms.envicon.nl/admin`
2. **Content Manager** → **Articles** → **Create new entry**
3. Fill in:
   - Title: "Test Article"
   - Slug: "test-article" (auto-generated)
   - Excerpt: "Test excerpt"
   - Content: "<p>Test</p>"
4. Leave `publishedAt` empty
5. Click **Save**

**Check for errors:**
- If it saves → Schema is working, API issue
- If it errors → Check error message in admin panel

### 5. Clear Cache and Rebuild

Sometimes cache causes issues:

```bash
cd strapi-cms
rm -rf .cache build dist
npm run build
# Restart Strapi
```

## Most Likely Causes

### Cause 1: Database NOT NULL Constraint

**Symptom:** Database still requires `publishedAt`
**Fix:** Alter database table to allow NULL

### Cause 2: Strapi Not Restarted

**Symptom:** Changes not taking effect
**Fix:** Restart Strapi in Plesk

### Cause 3: Database Migration Needed

**Symptom:** Schema updated but database structure unchanged
**Fix:** Run database migration or manually alter table

## Quick Database Check

If you have database access, check:

```sql
-- Check column definition
SHOW COLUMNS FROM articles WHERE Field = 'publishedAt';

-- Should show: Null = YES
-- If Null = NO, then:
ALTER TABLE articles MODIFY publishedAt DATETIME NULL;
```

## Summary

The schema file is correct, but the **database structure** may not match. Check:

1. ✅ Schema file: `publishedAt` is optional
2. ❓ Database: Does `publishedAt` allow NULL?
3. ❓ Strapi logs: What's the exact error?
4. ❓ Admin panel: Can you create articles there?

**Next step:** Check Strapi server logs for the exact error message - that will tell us what's wrong.

