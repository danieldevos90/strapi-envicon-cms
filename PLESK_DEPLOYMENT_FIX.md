# Plesk Deployment Fix - Content Types Not Showing

## Problem

Content types are not showing in the CMS permissions panel on Plesk. This is caused by missing compiled JavaScript files in the `dist` folder. The TypeScript compilation process was only compiling config files but not copying the API content-type files (controllers, routes, services) to the dist folder.

## Root Cause

When Strapi runs in production mode on Plesk, it looks for files in the `dist` folder. The previous build process:
- ✅ Compiled TypeScript config files (admin.ts, api.ts, etc.) to JavaScript
- ✅ Copied schema.json files for content types
- ❌ **Did NOT copy** controller, route, and service JavaScript files from `src/api` to `dist/src/api`

Without these files, Strapi cannot register the content types properly, causing them to not appear in the permissions panel.

## Solution

A new comprehensive build process has been created that:
1. Compiles all TypeScript files
2. Copies all API JavaScript files (controllers, routes, services)
3. Copies all schema.json files
4. Copies component schemas
5. Runs the Strapi admin build

## How to Fix on Plesk

### Step 1: Update the Code on Plesk

Upload or pull the latest changes that include:
- `build-complete.js` - New comprehensive build script
- `verify-build.js` - Build verification script
- Updated `package.json` with new build commands

### Step 2: Connect to Plesk via SSH

```bash
ssh your-username@your-plesk-server.com
cd /path/to/your/strapi-cms
```

### Step 3: Clean Previous Build

```bash
# Remove old dist folder
rm -rf dist/
rm -rf .strapi/
rm -rf .cache/
rm -rf build/
```

### Step 4: Run the New Build Process

```bash
# Run the complete build
npm run build

# Or explicitly:
npm run build:complete
```

This will:
- Clean the dist folder
- Compile TypeScript files
- Copy all API files
- Copy component schemas
- Build the admin panel

### Step 5: Verify the Build

```bash
npm run verify
```

This script checks that all required files are present in the dist folder. You should see output like:

```
🔍 Verifying Strapi build...

1️⃣  Checking dist folder...
✅ dist folder exists

2️⃣  Checking compiled config files...
✅ admin.js compiled
✅ api.js compiled
✅ database.js compiled
✅ middlewares.js compiled
✅ plugins.js compiled
✅ server.js compiled

3️⃣  Checking compiled index file...
✅ index.js compiled

4️⃣  Checking API content types...

  📦 article:
    ✅ schema.json
    ✅ controllers/ (1 file)
    ✅ routes/ (1 file)
    ✅ services/ (1 file)

  📦 homepage:
    ✅ schema.json
    ✅ controllers/ (1 file)
    ✅ routes/ (1 file)
    ✅ services/ (1 file)

... (and all other content types)

✅ Build verification PASSED! Ready for deployment.
```

### Step 6: Restart Strapi

```bash
# Using PM2 (if configured)
pm2 restart strapi-cms

# Or using the force-start script
npm run force-start

# Or manually
npm run start
```

### Step 7: Verify Content Types in Admin Panel

1. Log into your Strapi admin panel at `https://your-domain.com/admin`
2. Go to **Settings** → **Roles** → **Public** or any role
3. Go to the **Permissions** section
4. You should now see all content types listed under:
   - **Content Types Builder** (if enabled)
   - **Email** plugin
   - **i18n** plugin (if enabled)
   - **Media Library**
   - **Users-permissions** plugin
   - All your custom content types (Article, Homepage, Footer, etc.)

## Verification Checklist

Use this checklist to ensure everything is working:

- [ ] `dist/` folder exists and contains files
- [ ] `dist/config/` contains all `.js` config files
- [ ] `dist/src/index.js` exists
- [ ] `dist/src/api/` contains all content-type folders
- [ ] Each content type in `dist/src/api/` has:
  - [ ] `content-types/[name]/schema.json`
  - [ ] `controllers/[name].js`
  - [ ] `routes/[name].js`
  - [ ] `services/[name].js`
- [ ] `dist/src/components/` contains all component schemas
- [ ] `.strapi/` folder exists (admin build)
- [ ] Strapi starts without errors
- [ ] Content types appear in admin permissions panel

## Troubleshooting

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Check TypeScript version
npm ls typescript

# Reinstall TypeScript
npm install typescript@5 --save-dev

# Try build again
npm run build
```

### Issue: "Cannot find module" errors when starting Strapi

**Solution:**
```bash
# Check if all dependencies are installed
npm install

# Verify node_modules exist
ls -la node_modules/

# Try build and start again
npm run build
npm run start
```

### Issue: Content types still not showing after build

**Solution:**
```bash
# Run verification to see what's missing
npm run verify

# Check if specific content type files exist
ls -la dist/src/api/article/controllers/
ls -la dist/src/api/article/routes/
ls -la dist/src/api/article/services/

# If files are missing, run build again
npm run build:complete
```

### Issue: Permission denied errors on Plesk

**Solution:**
```bash
# Ensure correct ownership
chown -R your-user:your-group /path/to/strapi-cms

# Ensure correct permissions
chmod -R 755 /path/to/strapi-cms
chmod -R 777 /path/to/strapi-cms/public/uploads
```

## For Future Deployments

Always use the new build command:

```bash
npm run build
```

This ensures all files are properly compiled and copied to the dist folder.

## Additional Notes

- The `build:strapi` command runs only the Strapi build (old behavior)
- The `build:complete` command runs the full build with file copying
- The `build` command is now aliased to `build:complete`
- Always run `npm run verify` after building to ensure everything is correct

## Need More Help?

If content types are still not showing after following these steps:

1. Check Strapi logs for errors:
   ```bash
   pm2 logs strapi-cms
   # or
   tail -f logs/strapi.log
   ```

2. Check if database connection is working:
   ```bash
   npm run test:mysql
   ```

3. Verify environment variables are set correctly:
   ```bash
   npm run check-env
   ```

4. Contact support with:
   - Output of `npm run verify`
   - Strapi logs
   - Node and NPM versions: `node -v && npm -v`





