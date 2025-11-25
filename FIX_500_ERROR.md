# Fix 500 Error on Homepage

## Error
```
[Error] Failed to load resource: the server responded with a status of 500 () (api::homepage.homepage, line 0)
```

## Cause
The production Strapi server is trying to load the homepage schema, but it references components that don't exist on the server yet (specifically `sections.benefits-section`).

## Solution

### Step 1: Pull Latest Code
```bash
cd /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/strapi-cms
git pull origin main
```

### Step 2: Verify Component Files Exist
```bash
ls -la src/components/sections/benefits-section.json
ls -la src/components/ui/feature.json
ls -la src/components/ui/contact-method.json
```

All three files should exist.

### Step 3: Rebuild Strapi
```bash
npm run build
```

This will:
- Compile all schema files
- Register the new `benefits-section` component
- Update component definitions (`ui.feature`, `ui.contact-method`)

### Step 4: Restart Strapi
```bash
npm run restart
# OR
pm2 restart strapi-cms
```

### Step 5: Clear Browser Cache
- Clear browser cache or use incognito mode
- Refresh the Strapi admin page

## Expected Result

After these steps:
- ✅ The 500 error should be gone
- ✅ The homepage should load in Strapi Admin
- ✅ All 11 component fields should be visible
- ✅ The `benefits` field should appear

## If Error Persists

### Check Strapi Logs
```bash
pm2 logs strapi-cms
# OR
tail -f logs/strapi.log
```

Look for errors related to:
- Component registration
- Schema parsing
- Missing component files

### Verify Component Registration
1. Go to Content-Type Builder
2. Check if `sections.benefits-section` appears in components list
3. If not, the component file might not be loading correctly

### Temporary Fix (if needed)
If you need the site to work immediately, you can temporarily remove the `benefits` field from the homepage schema:

```json
// Remove this from homepage/schema.json temporarily:
"benefits": {
  "type": "component",
  "repeatable": false,
  "component": "sections.benefits-section"
},
```

Then rebuild and restart. But the proper fix is to pull the latest code and rebuild.

## Quick Fix Command

```bash
cd /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/strapi-cms && \
git pull origin main && \
npm run build && \
npm run restart
```

