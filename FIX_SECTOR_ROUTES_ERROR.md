# Fix Sector Routes Error

## The Error

```
Cannot read properties of undefined (reading 'kind')
TypeError: Cannot read properties of undefined (reading 'kind')
    at Object.isSingleType
    at Object.createRoutes
    at get routes [as routes]
    at Object.<anonymous> (/var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/dist/src/api/sector/routes/sector.js:13:22)
```

## Root Cause

The sector routes file was trying to spread `defaultRouter.routes` before Strapi had fully loaded the content type. This caused Strapi to crash on startup because it couldn't find the sector content type definition.

## The Fix

Simplified the sector routes to use the standard Strapi pattern:

**Before:**
```javascript
const defaultRouter = createCoreRouter('api::sector.sector');
module.exports = {
  routes: [
    ...defaultRouter.routes,
    // custom routes
  ],
};
```

**After:**
```javascript
module.exports = createCoreRouter('api::sector.sector');
```

## Why This Fixes It

The standard `createCoreRouter` pattern ensures Strapi properly loads the content type before creating routes. The custom route spreading was happening too early, before the content type was registered.

## Custom Routes

If you need the custom `/sectors/populate-all` route, you can add it back after ensuring Strapi starts properly, or create it as a separate route file.

## Next Steps

1. **Rebuild Strapi:**
   ```bash
   cd strapi-cms
   npm run build
   ```

2. **Restart Strapi** (via Plesk)

3. **Test:** Strapi should start without crashing

4. **Test article creation:**
   ```bash
   npm run test:article:logs
   ```

## Expected Result

After rebuild:
- ✅ Strapi starts without crashing
- ✅ Sector routes work
- ✅ Article creation should work
- ✅ No more "Cannot read properties of undefined" error

