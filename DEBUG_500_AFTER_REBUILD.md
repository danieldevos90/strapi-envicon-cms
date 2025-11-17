# Debugging 500 Errors After Rebuild

## Status

After rebuild, article API still returns 500 errors. This suggests:

1. **Strapi wasn't restarted** after rebuild
2. **Database migration needed** - Schema changes may require database updates
3. **Another issue** - Not just the schema

## Troubleshooting Steps

### Step 1: Verify Strapi Restarted

After rebuild, Strapi MUST be restarted:

**Via Plesk:**
1. Log into Plesk
2. Go to **Domains** → **cms.envicon.nl** → **Node.js**
3. Click **Restart App**
4. Wait for restart to complete

**Check if restarted:**
- Admin panel should be accessible
- Health check should work
- API should respond

### Step 2: Check Strapi Logs

The logs will show the exact error causing the 500:

**Via Plesk:**
1. Go to **Logs** → **Error Log**
2. Look for errors around the time you tried to create an article
3. Look for database errors, validation errors, or schema errors

**Or check Strapi logs:**
```bash
tail -f strapi-cms/logs/*.log
```

### Step 3: Database Migration

Schema changes may require database migration:

1. Check if database structure matches schema
2. Verify `publishedAt` column exists and allows NULL
3. May need to run migration manually

### Step 4: Verify Schema in Admin Panel

1. Go to `https://cms.envicon.nl/admin`
2. Navigate to **Content-Type Builder** → **Article**
3. Check `publishedAt` field:
   - Should show as **Optional** (not Required)
   - Type should be **DateTime**

If it still shows as Required → Rebuild didn't work properly

### Step 5: Test with Different Data

Try creating article via admin panel:
1. Go to **Content Manager** → **Articles** → **Create new entry**
2. Fill in required fields (title, slug, excerpt, content)
3. Leave `publishedAt` empty
4. Click **Save**
5. Check for errors

## Common Issues After Rebuild

### Issue 1: Strapi Not Restarted

**Symptom:** Changes not taking effect
**Fix:** Restart Strapi in Plesk

### Issue 2: Database Migration Needed

**Symptom:** Schema updated but database structure doesn't match
**Fix:** May need to manually update database or run migration

### Issue 3: Cache Issues

**Symptom:** Old schema still being used
**Fix:** Clear cache and rebuild:
```bash
cd strapi-cms
rm -rf .cache build dist
npm run build
# Restart Strapi
```

### Issue 4: Build Failed Silently

**Symptom:** Rebuild completed but errors occurred
**Fix:** Check build logs for errors:
```bash
cd strapi-cms
npm run build 2>&1 | tee build.log
```

## Next Steps

1. **Check Strapi logs** for detailed error message
2. **Verify Strapi restarted** after rebuild
3. **Test via admin panel** to see if same error occurs
4. **Check database** structure matches schema
5. **Try clearing cache** and rebuilding again

## Quick Test Commands

```bash
# Test admin panel
curl -I https://cms.envicon.nl/admin

# Test health
curl https://cms.envicon.nl/_health

# Test API (public)
curl https://cms.envicon.nl/api/articles?pagination[limit]=1

# Test create (with auth)
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data":{"title":"Test","slug":"test","excerpt":"Test","content":"<p>Test</p>"}}' \
  https://cms.envicon.nl/api/articles
```

## Most Likely Issue

**Strapi wasn't restarted after rebuild** - The rebuild creates new files, but Strapi needs to be restarted to load them.

