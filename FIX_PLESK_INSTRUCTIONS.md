# Fix Content Types Not Showing on Plesk - Quick Instructions

## The Problem
Content types are not showing in Strapi admin permissions panel on Plesk because the `dist` folder is missing the API controller, route, and service files.

## The Cause
The TypeScript build was only compiling config files but not copying the JavaScript API files to the dist folder. Strapi in production mode looks for these files in `dist/src/api/` but they weren't there.

## Quick Fix (Recommended for Immediate Fix)

### Option A: Quick Fix Script (5 minutes)

**On your Plesk server via SSH:**

```bash
# 1. Navigate to your Strapi directory
cd /path/to/your/strapi-cms

# 2. Run the quick fix
npm run quick-fix

# 3. Verify the fix
npm run verify

# 4. Restart Strapi
npm run restart
# or if using PM2:
pm2 restart strapi-cms
```

That's it! Your content types should now appear in the admin panel.

---

## Complete Fix (Recommended for Long-Term)

### Option B: Full Rebuild (10 minutes)

This ensures everything is properly built for future deployments.

**On your Plesk server via SSH:**

```bash
# 1. Navigate to your Strapi directory
cd /path/to/your/strapi-cms

# 2. Clean previous builds
rm -rf dist/
rm -rf .strapi/
rm -rf .cache/

# 3. Pull latest changes (if you updated from git)
git pull origin main

# 4. Install any new dependencies
npm install

# 5. Run the complete build
npm run build

# 6. Verify everything is correct
npm run verify

# 7. Restart Strapi
npm run restart
# or if using PM2:
pm2 restart strapi-cms
```

---

## Verification Steps

After running either fix, verify that content types are showing:

1. **Check Build Verification Output**
   ```bash
   npm run verify
   ```
   You should see: `✅ Build verification PASSED! Ready for deployment.`

2. **Check Strapi Logs**
   ```bash
   # If using PM2
   pm2 logs strapi-cms --lines 50
   
   # Or check the log file
   tail -f logs/strapi.log
   ```
   Look for any errors during startup.

3. **Check Admin Panel**
   - Go to: `https://your-domain.com/admin`
   - Navigate to: **Settings** → **Roles** → **Public**
   - Click on **Permissions**
   - Verify you see all these sections:
     - ✅ Content Types Builder
     - ✅ Email
     - ✅ i18n
     - ✅ Media Library
     - ✅ Users-permissions
     - ✅ Article
     - ✅ Envicon Seo Config
     - ✅ Footer
     - ✅ Forms Config
     - ✅ Homepage
     - ✅ Navigation
     - ✅ Process Step
     - ✅ Sector
     - ✅ Service
     - ✅ Solution

---

## Troubleshooting

### Issue: "Cannot find module" errors

```bash
npm install
npm run build
```

### Issue: Permission denied

```bash
# Fix ownership (replace with your user)
sudo chown -R your-user:your-group /path/to/strapi-cms

# Fix permissions
chmod -R 755 /path/to/strapi-cms
chmod -R 777 /path/to/strapi-cms/public/uploads
```

### Issue: Build fails

```bash
# Check Node version (should be 18.x or 20.x)
node -v

# If wrong version, use nvm to switch:
nvm use 20

# Try build again
npm run build
```

### Issue: Content types still not showing

```bash
# Check if files exist in dist
ls -la dist/src/api/article/controllers/
ls -la dist/src/api/article/routes/
ls -la dist/src/api/article/services/

# If empty, run quick fix again
npm run quick-fix
npm run restart
```

---

## What Was Fixed

Three new scripts were created:

1. **`build-complete.js`** - Comprehensive build that compiles TypeScript AND copies JavaScript files
2. **`verify-build.js`** - Verifies all required files are in dist folder
3. **`quick-fix-dist.js`** - Quick fix to copy missing API files without full rebuild

New npm commands available:

- `npm run build` - Full build (now uses build-complete.js)
- `npm run verify` - Verify build is complete
- `npm run quick-fix` - Quick fix for missing files

---

## For Future Deployments

Always run the complete build process:

```bash
npm run build
npm run verify
```

This ensures all TypeScript and JavaScript files are properly compiled and copied to the dist folder.

---

## Need Help?

If you're still having issues after trying both fixes:

1. Run the verification:
   ```bash
   npm run verify > verify-output.txt
   ```

2. Collect error logs:
   ```bash
   pm2 logs strapi-cms --lines 100 > strapi-logs.txt
   ```

3. Check environment:
   ```bash
   npm run check-env > env-check.txt
   ```

4. Send these three files for further assistance.

---

## Summary

- **Immediate fix**: `npm run quick-fix && npm run restart`
- **Complete fix**: `npm run build && npm run verify && npm run restart`
- **Verify it worked**: Check admin panel → Settings → Roles → Permissions

The fix copies the missing controller, route, and service JavaScript files to the dist folder so Strapi can properly register all content types in production mode.

