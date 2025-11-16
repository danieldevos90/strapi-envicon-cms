# Get Exact Error from Strapi Logs

## Current Status

After all steps:
- ✅ Schema updated
- ✅ Database column created
- ✅ Cache cleared
- ✅ Strapi rebuilt
- ✅ Strapi restarted

❌ Still getting 500 errors

## Critical: We Need the Exact Error

The generic "Internal Server Error" doesn't tell us what's wrong. We need the **actual error message** from Strapi application logs.

## How to Get Strapi Logs

### Method 1: Via Plesk Node.js Logs

1. Log into Plesk
2. Go to **Domains** → **cms.envicon.nl** → **Node.js**
3. Click **"View Logs"** or **"Application Logs"**
4. Look for errors around the time you tried to create an article
5. **Copy the exact error message** - it will show:
   - What field is causing the issue
   - What validation is failing
   - What database error occurred
   - Stack trace showing where it failed

### Method 2: Via Plesk File Manager

1. Go to **Files** → **File Manager**
2. Navigate to your Strapi directory
3. Check `logs/` folder:
   - `strapi.log`
   - `strapi-output.log`
   - `strapi-startup.log`
4. Look for errors with timestamps matching when you tried to create articles

### Method 3: Via SSH (if available)

```bash
cd /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs
tail -100 logs/*.log | grep -A 20 -B 5 "error\|Error\|ERROR"
```

## What to Look For

The error message will tell us:

1. **If it's a validation error:**
   ```
   ValidationError: publishedAt is required
   ```
   → Schema validation issue

2. **If it's a database error:**
   ```
   DatabaseError: Column 'publishedAt' cannot be null
   ```
   → Database constraint issue

3. **If it's a field error:**
   ```
   FieldError: Unknown field 'publishedAt'
   ```
   → Strapi doesn't recognize the column

4. **If it's a type error:**
   ```
   TypeError: Cannot read property...
   ```
   → Code issue

## Test via Admin Panel

Also try creating an article in the admin panel:

1. Go to `https://cms.envicon.nl/admin`
2. **Content Manager** → **Articles** → **Create new entry**
3. Fill in:
   - Title: "Test Article"
   - Slug: "test-article" (auto-generated)
   - Excerpt: "Test excerpt"
   - Content: "<p>Test</p>"
4. Leave `publishedAt` empty
5. Click **Save**

**If it works in admin:**
- API authentication/validation issue
- Check API token permissions

**If it fails in admin:**
- Check the error message shown in the admin panel
- This will tell you exactly what's wrong

## Common Errors We Might See

### Error 1: Validation Error
```
ValidationError: publishedAt is required
```
**Fix:** Check schema file has `required: false`

### Error 2: Database Constraint
```
DatabaseError: Column 'publishedAt' cannot be null
```
**Fix:** Check database column allows NULL

### Error 3: Column Not Found
```
DatabaseError: Unknown column 'publishedAt'
```
**Fix:** Column doesn't exist, need to create it

### Error 4: Type Mismatch
```
TypeError: Invalid date format
```
**Fix:** Column type mismatch

## Next Steps

1. **Get Strapi logs** - This is the most important step
2. **Test via admin panel** - See if same error occurs
3. **Share the exact error message** - Then we can fix it

Without the exact error message, we're guessing. The logs will tell us exactly what's wrong.

