# Fixing Admin Panel 404 Error

## Current Status

- ✅ **Root URL**: HTTP 302 (redirects to /admin)
- ✅ **Health Check**: HTTP 204 (working)
- ✅ **API Endpoints**: HTTP 200 (working)
- ❌ **Admin Panel**: HTTP 404 (not found)

## Problem

The admin panel at `https://cms.envicon.nl/admin` is returning 404, even though:
- Strapi is running (health check works)
- API endpoints work
- Root URL redirects to `/admin`

## Possible Causes

1. **Admin panel not built** - Strapi needs to be rebuilt after schema changes
2. **Build directory missing** - The `build` or `dist` folder might be missing
3. **Routing issue** - Admin routes might not be configured correctly
4. **Plesk configuration** - Node.js app might need restart or rebuild

## Solutions

### Solution 1: Rebuild Strapi (Most Likely Fix)

```bash
cd strapi-cms
npm run build
```

Then restart Strapi via Plesk.

### Solution 2: Check Build Directory

Verify the build exists:
```bash
ls -la strapi-cms/build
# or
ls -la strapi-cms/dist
```

If missing, rebuild:
```bash
cd strapi-cms
npm run build
```

### Solution 3: Restart Strapi on Plesk

1. Log into Plesk
2. Go to **Domains** → **cms.envicon.nl** → **Node.js**
3. Click **Restart App**

### Solution 4: Check Strapi Configuration

Verify `config/server.js` or `config/env/production/server.js`:
- Check `admin.url` configuration
- Verify `admin.path` is set to `/admin`
- Check for any routing issues

### Solution 5: Check Plesk Node.js Settings

1. Verify Node.js version (should be 18.x or 20.x)
2. Check application startup file
3. Verify environment variables are set
4. Check application logs for errors

## Quick Test Commands

```bash
# Check if build exists
ls strapi-cms/build

# Rebuild Strapi
cd strapi-cms
npm run build

# Check Strapi logs
tail -f strapi-cms/logs/*.log
```

## After Rebuild

1. **Rebuild Strapi**: `npm run build`
2. **Restart via Plesk**: Restart Node.js app
3. **Test admin panel**: Visit `https://cms.envicon.nl/admin`
4. **Check logs**: Look for any errors in Plesk logs

## Expected Behavior

After fix:
- `https://cms.envicon.nl` → Redirects to `/admin`
- `https://cms.envicon.nl/admin` → Shows Strapi admin login page
- `https://cms.envicon.nl/api/*` → API endpoints work

## Most Likely Fix

Since you just made schema changes, you need to rebuild:

```bash
cd strapi-cms
npm run build
```

Then restart Strapi in Plesk.

