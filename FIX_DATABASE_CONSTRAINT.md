# Fix Database Constraint for publishedAt

## The Problem

Apache logs show 500 errors on `POST /api/articles`, but the actual error is likely in the database.

## Most Likely Issue: Database NOT NULL Constraint

Even though the schema file says `publishedAt` is optional (`required: false`), the **database table** may still have a NOT NULL constraint.

## Solution: Update Database Table

### If you have database access (phpMyAdmin, MySQL client, etc.):

```sql
-- Check current column definition
SHOW COLUMNS FROM articles WHERE Field = 'publishedAt';

-- If Null = 'NO', then update it:
ALTER TABLE articles MODIFY publishedAt DATETIME NULL;
```

### Via phpMyAdmin in Plesk:

1. Log into Plesk
2. Go to **Databases** → **phpMyAdmin**
3. Select your database
4. Click on `articles` table
5. Click **Structure** tab
6. Find `publishedAt` column
7. Click **Change** (pencil icon)
8. Under **Null**, select **NULL**
9. Click **Save**

### Via Plesk Database Management:

1. Log into Plesk
2. Go to **Databases**
3. Find your Strapi database
4. Click **Webadmin** (phpMyAdmin)
5. Run the SQL:
   ```sql
   ALTER TABLE articles MODIFY publishedAt DATETIME NULL;
   ```

## Verify the Fix

After updating the database:

1. Test article creation:
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "data": {
         "title": "Test Article",
         "slug": "test-article",
         "excerpt": "Test excerpt",
         "content": "<p>Test</p>"
       }
     }' \
     https://cms.envicon.nl/api/articles
   ```

2. Should return HTTP 200 instead of 500

## Why This Happens

When you change the schema:
- ✅ Schema file updates immediately
- ✅ Strapi rebuilds admin panel
- ❌ Database structure doesn't auto-update

The database table structure needs to be manually updated to match the schema.

## Alternative: Check Strapi Logs First

Before modifying the database, check Strapi logs to confirm:

**Via Plesk:**
- **Domains** → **cms.envicon.nl** → **Node.js** → **View Logs**

Look for errors mentioning:
- `publishedAt`
- `NOT NULL`
- `constraint`
- `validation`

The error message will confirm if it's a database constraint issue.

## Summary

1. **Check Strapi logs** to confirm the error
2. **Update database** to allow NULL for `publishedAt`
3. **Test again** - should work now

The schema is correct, but the database needs to match it.

