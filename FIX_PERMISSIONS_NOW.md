# 🚨 URGENT: Fix Missing Content Types in Permissions

## Problem
The About-page, Contact-page, and Project content types are missing from the Roles & Permissions interface in Strapi admin.

## ✅ Solution Deployed
**Git Commit**: `b0c5fb3` - Fix missing content types in permissions system

---

## 🔧 Steps to Fix on Plesk Server

### 1. Pull Latest Changes
```bash
cd /path/to/your/strapi-cms
git pull origin main
```

### 2. Rebuild Strapi
```bash
npm run build
```

### 3. Restart Strapi
```bash
# If using PM2
pm2 restart strapi-cms

# OR if using npm directly
npm start
```

### 4. Run Permission Fix Script
```bash
# This will force regenerate all permissions
node fix-permissions-registration.js
```

### 5. Verify in Admin Panel
1. Go to: `https://yourdomain.com:1337/admin`
2. Login with: admin@envicon.nl / Envicon2024!Admin
3. Navigate to: Settings → Roles → Public → Permissions
4. You should now see ALL content types:
   - ✅ Article
   - ✅ Envicon-seo-config  
   - ✅ Footer
   - ✅ Forms-config
   - ✅ Homepage
   - ✅ Navigation
   - ✅ Process-step
   - ✅ Sector
   - ✅ Service
   - ✅ Solution
   - ✅ **About-page** ← Should now appear
   - ✅ **Contact-page** ← Should now appear  
   - ✅ **Project** ← Should now appear

---

## 🔍 What Was Fixed

### 1. Updated `src/index.ts`
Added missing content types to the bootstrap permissions:
```typescript
const permissions = {
  // Collection types
  'api::project': ['find', 'findOne'],
  // Single types  
  'api::about-page': ['find'],
  'api::contact-page': ['find'],
  // ... other content types
};
```

### 2. Created Fix Script
`fix-permissions-registration.js` - Forces regeneration of all permissions and tests API endpoints.

---

## 🧪 Test After Fix

Run this to verify all endpoints work:
```bash
node fix-permissions-registration.js
```

Expected output:
```
✅ /api/homepage: 1 items
✅ /api/articles: X items  
✅ /api/sectors: X items
✅ /api/services: X items
✅ /api/solutions: X items
✅ /api/projects: X items
✅ /api/about-page: 1 items
✅ /api/contact-page: 1 items
```

---

## 🚨 If Still Not Working

### Option 1: Manual Permission Reset
1. In Strapi admin: Settings → Roles → Public
2. Manually enable permissions for missing content types:
   - About-page: find ✅
   - Contact-page: find ✅  
   - Project: find ✅, findOne ✅

### Option 2: Complete Rebuild
```bash
# Nuclear option - complete rebuild
rm -rf dist node_modules
npm install
npm run build
pm2 restart strapi-cms
node fix-permissions-registration.js
```

---

## ✅ Success Criteria

After the fix, you should have:
- [x] All content types visible in Permissions interface
- [x] API endpoints responding correctly
- [x] Public role has read access to all content types
- [x] Frontend can fetch data from all endpoints

---

**Status**: 🔧 Fix deployed, ready to apply on server  
**Git Commit**: `b0c5fb3`  
**Next**: Pull changes and restart Strapi
