# Debug Homepage 500 Error

## Current Status
- ✅ Build completed successfully
- ✅ Strapi started (but was killed - exit code 137)
- ❌ Homepage still returns 500 error

## Possible Causes

### 1. Component Registration Issue
The `sections.benefits-section` component might not be properly registered even after build.

### 2. Database Schema Mismatch
The database might have old homepage data that conflicts with the new schema.

### 3. Memory Issues
Exit code 137 suggests the process was killed (possibly OOM).

## Debugging Steps

### Step 1: Check Component Registration
```bash
cd /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/strapi-cms
# Check if component file exists
ls -la src/components/sections/benefits-section.json
# Check if it was built
ls -la dist/src/components/sections/benefits-section.js
```

### Step 2: Check Strapi Logs for Specific Error
```bash
pm2 logs strapi-cms --lines 50
# OR
tail -50 logs/strapi.log
```

Look for errors like:
- "Component sections.benefits-section not found"
- "Invalid component reference"
- Schema validation errors

### Step 3: Temporary Fix - Remove Benefits Field
If the error persists, temporarily remove the benefits field:

**Edit `src/api/homepage/content-types/homepage/schema.json`:**
```json
{
  "attributes": {
    "hero": { ... },
    "about": { ... },
    "intro": { ... },
    "gallery": { ... },
    "solutions": { ... },
    "articles": { ... },
    "sectors": { ... },
    "process": { ... },
    "services": { ... },
    // "benefits": {  // COMMENT OUT TEMPORARILY
    //   "type": "component",
    //   "repeatable": false,
    //   "component": "sections.benefits-section"
    // },
    "contact": { ... }
  }
}
```

Then rebuild and restart:
```bash
npm run build
npm run restart
```

### Step 4: Check Database Content
The homepage might have corrupted data. Check in MySQL:
```sql
USE enviconnl_strapi;
SELECT * FROM homepages LIMIT 1;
```

### Step 5: Clear Strapi Cache
```bash
rm -rf .cache
rm -rf dist
npm run build
npm run restart
```

## Alternative: Manual Component Creation

If the component file isn't being recognized, create it manually in Strapi Admin:

1. Go to **Content-Type Builder** → **Components**
2. Create new component: `sections.benefits-section`
3. Add fields:
   - `title` (Text, required)
   - `subtitle` (Long text, optional)
   - `benefits` (Repeatable component: `ui.feature`)

## Quick Diagnostic Commands

```bash
# Check if all component files exist
find src/components -name "*.json" | grep -E "(benefits|feature|contact-method)"

# Check if they were compiled
find dist/src/components -name "*.js" | grep -E "(benefits|feature|contact-method)"

# Check Strapi process
ps aux | grep strapi
```

## Expected Files After Git Pull

These files should exist:
- ✅ `src/components/sections/benefits-section.json`
- ✅ `src/components/ui/feature.json` (updated)
- ✅ `src/components/ui/contact-method.json` (updated)
- ✅ `src/api/homepage/content-types/homepage/schema.json` (updated)

If any are missing, the git pull didn't work correctly.
