# 🔧 Configure Local Strapi - Step by Step

## Current Situation:

- ✅ Local Strapi running at http://localhost:1337
- ✅ Admin account created: admin@envicon.nl / Envicon2024!Admin
- ✅ Content types exist but need permissions configured
- ✅ API endpoints exist but return 405 (permissions not set)
- ❌ Content Manager appears empty (needs permissions)

##  Why This Happens:

Strapi v5 requires public permissions to be set through the admin interface for content to be visible and accessible via API.

---

## 🎯 Fix It Now (Takes 2 minutes):

### STEP 1: Login to Local Strapi Admin

1. Go to: **http://localhost:1337/admin**
2. Login with:
   - Email: `admin@envicon.nl`
   - Password: `Envicon2024!Admin`

### STEP 2: Set Public Permissions

1. Click **Settings** ⚙️ (bottom left sidebar)
2. Under "Users & Permissions Plugin", click **Roles**
3. Click **Public** role
4. You'll see a list of all content types

### STEP 3: Enable All Permissions

For EACH content type below, check ALL boxes:

**Single Types (Check ALL):**
- ✅ **Homepage** - find
- ✅ **Navigation** - find  
- ✅ **Footer** - find
- ✅ **Forms-config** - find
- ✅ **Envicon-seo-config** - find

**Collection Types (Check ALL):**
- ✅ **Article** - find, findOne
- ✅ **Solution** - find, findOne
- ✅ **Sector** - find, findOne
- ✅ **Service** - find, findOne
- ✅ **Process-step** - find, findOne

### STEP 4: Save

Click **Save** button (top right)

---

## ✅ Verify Permissions Work:

After saving, test the API:

```bash
# Should return content (currently empty but should work)
curl "http://localhost:1337/api/articles"
# Should return: {"data":[],"meta":{...}}

curl "http://localhost:1337/api/homepage"
# Should return: {"data":null} or content
```

If you get `{"data":null}` or `{"data":[]}` instead of 404 errors, permissions are working! ✅

---

## 📥 Then Import Content:

### Option A: Use Import Script (After Permissions Set):

The import script still returns 405 because it tries to POST/PUT. For now, manually add content or use Option B.

### Option B: Add Content Manually (Recommended for Local):

1. Go to **Content Manager** (left sidebar)
2. You'll now see all content types!
3. Click each type and add content manually:
   - Click "+ Create new entry"
   - Fill in the fields
   - Click **Save** then **Publish**

### Option C: Use Production Strapi (Current Setup - EASIEST):

Your frontend is already configured to use production Strapi (https://cms.envicon.nl) which has all the content! This works perfectly right now.

---

## 🌐 After Configuration:

Once permissions are set, your local Strapi will:
- ✅ Show all content types in Content Manager
- ✅ Allow you to create/edit content
- ✅ Make API endpoints accessible
- ✅ Work with your local frontend (if you update .env.local)

---

## 🎯 Recommended Approach:

**For Now:**
- ✅ Keep using production Strapi for content
- ✅ Your frontend at http://localhost:3000 works perfectly
- ✅ Edit content at https://cms.envicon.nl/admin
- ✅ Focus on building features, not fighting with local Strapi setup

**Later:**
- Set up local Strapi permissions when you need offline development
- Add content manually or through admin panel
- Use for testing without affecting production

---

## ✅ Current Working Setup:

```
Local Frontend (http://localhost:3000)
           ↓
    Fetches content from
           ↓
Production Strapi (https://cms.envicon.nl)
           ↓
    Same content as
           ↓  
Live Site (https://envicon.nl)
```

**This works perfectly! ✅**

---

**Need the Content Manager to work locally?**
Follow STEP 1-4 above to set permissions! Takes 2 minutes! 🚀





