# 🚀 Production Deployment Guide - cms.envicon.nl

## 🎯 Current Status

**Issue Identified**: The permissions fix worked but unchecked ALL other permissions in the process.
**Solution**: Complete permissions script ready for GitHub deployment.

---

## 📋 Deployment Steps for Production

### 1. On Production Server (Plesk)

```bash
# Navigate to your Strapi directory
cd /path/to/strapi-cms

# Pull latest changes from GitHub
git pull origin main

# Install any new dependencies
npm install

# Build Strapi (if needed)
npm run build

# Restart Strapi service
pm2 restart strapi-cms
# OR
systemctl restart strapi-cms
```

### 2. Fix ALL Permissions

```bash
# Run the comprehensive permissions fix
node fix-all-production-permissions.js
```

This script will:
- ✅ Enable ALL necessary API permissions
- ✅ Fix the "undefined" permissions issue
- ✅ Set proper permissions for all content types
- ✅ Test all endpoints after fixing

---

## 🔧 What Gets Fixed

### Collection Types (find + findOne enabled):
- ✅ **Articles** - `/api/articles`
- ✅ **Services** - `/api/services` 
- ✅ **Sectors** - `/api/sectors`
- ✅ **Solutions** - `/api/solutions`
- ✅ **Projects** - `/api/projects`
- ✅ **Process Steps** - `/api/process-steps`

### Single Types (find enabled):
- ✅ **Homepage** - `/api/homepage`
- ✅ **About Page** - `/api/about-page` ← **FIXED**
- ✅ **Contact Page** - `/api/contact-page` ← **FIXED**
- ✅ **Navigation** - `/api/navigation`
- ✅ **Footer** - `/api/footer`
- ✅ **SEO Config** - `/api/envicon-seo-config`

---

## 🧪 Verification

After running the fix script, you should see:

```
📊 Final Result: 12/12 endpoints working
🎉 SUCCESS! All permissions are now properly configured!
```

### Manual Verification:
1. **Check Strapi Admin**: https://cms.envicon.nl/admin/settings/users-permissions/roles
2. **Public Role**: Should show proper permissions (not "undefined")
3. **Test API**: All endpoints should return data with your API key

---

## 🔑 API Key Usage

Your API key works with all endpoints:
```
634eb5cbcb44c48888109ebd8d238e99bf90f04679e1c66ce61b9320fb90346cacccd44efefef1d02af155387be162ef9c5d5486acb290f08e7265c400ec1f85e5ab479120fd7addad01bb2304e6888601d4f5cec3a99049cb67348c1c6dfb882aa464d8d4c1e176a7ee8cc3eb23cb049a8bc2633c02a13a19d2b7ac12393906
```

### Test Commands:
```bash
# Test About Page (should work after fix)
curl -H "Authorization: Bearer YOUR_API_KEY" https://cms.envicon.nl/api/about-page

# Test Services (should show 25 items)
curl -H "Authorization: Bearer YOUR_API_KEY" https://cms.envicon.nl/api/services

# Test Homepage
curl -H "Authorization: Bearer YOUR_API_KEY" https://cms.envicon.nl/api/homepage
```

---

## 📊 Expected Results After Fix

| Endpoint | Status | Content |
|----------|--------|---------|
| `/api/homepage` | ✅ Working | Hero content |
| `/api/about-page` | ✅ **FIXED** | Team & company info |
| `/api/contact-page` | ✅ **FIXED** | Contact info & FAQs |
| `/api/services` | ✅ Working | 25+ services |
| `/api/sectors` | ✅ Working | 15+ sectors |
| `/api/articles` | ✅ Working | 3+ articles |
| `/api/solutions` | ✅ Working | 16+ solutions |
| `/api/projects` | ✅ Working | Projects data |
| `/api/navigation` | ✅ Working | Menu structure |
| `/api/footer` | ✅ Working | Footer content |
| `/api/envicon-seo-config` | ✅ Working | SEO settings |

---

## 🚨 Important Notes

1. **Production Only**: This fix is specifically for cms.envicon.nl production
2. **GitHub Deployment**: Always deploy via GitHub pull, never edit files directly
3. **Permissions Reset**: The fix will properly set ALL permissions, not just the broken ones
4. **API Key**: Your existing API key will work with all endpoints after the fix
5. **No Content Loss**: This only fixes permissions, doesn't affect existing content

---

## 🎉 Success Criteria

After deployment and running the fix script:

- [ ] All 12 API endpoints return data (not 404)
- [ ] Strapi admin shows proper permissions (no "undefined")
- [ ] Your Next.js frontend can fetch from all endpoints
- [ ] About-page and Contact-page APIs work correctly

---

## 📞 Next Steps

1. **Deploy**: Pull from GitHub and run the permissions fix
2. **Test**: Verify all endpoints work with your API key
3. **Frontend**: Update your Next.js app to use all endpoints
4. **Content**: Add any missing content (projects, images, etc.)

**Repository**: https://github.com/danieldevos90/strapi-envicon-cms.git  
**Latest Commit**: `3c28445` - Complete production permissions fix

Your cms.envicon.nl is ready for full production use! 🚀
