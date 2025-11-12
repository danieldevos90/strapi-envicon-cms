# 📸 Upload Images to Strapi - Quick Guide

## Images That Need to be Uploaded

### For Solutions (4 images + 4 icons):
**Images:**
- `public/sport-hall.png` → Demontabel gebouw
- `public/Overkapping.jpg` → Overkapping
- `public/modulaire-unit.jpg` → Modulaire unit
- `public/Loods.png` → Loods

**Icons:**
- `public/eDEMONTABEL 1.svg` → Demontabel icon
- `public/eOVERKAPPINGEN 1.svg` → Overkapping icon
- `public/eMODULAIRE 1.svg` → Modulaire unit icon
- `public/eLOODSEN 1.svg` → Loods icon

### For Articles (3 images):
- `public/images/WhatsApp Image 2025-08-05 at 09.18.16.jpeg` → Hoogtepunt bereikt
- `public/images/WhatsApp Image 2025-07-23 at 16.46.32.jpeg` → De bouw is van start
- `public/images/WhatsApp Image 2025-06-27 at 10.35.19.jpeg` → Gemeente Molenlanden

### For Hero (optional - already working from /public):
- `public/images/headline-website-1.jpg`
- `public/images/headline-website-2.jpg`

---

## 🚀 Quick Upload (5 Minutes):

### For LOCAL Strapi (http://localhost:1337):

1. **Go to Media Library:**
   - Open http://localhost:1337/admin
   - Login: admin@envicon.nl / Envicon2024!Admin
   - Click "Media Library" in left sidebar

2. **Upload Files:**
   - Click "+ Add new assets"
   - Drag and drop all images from `public/` folder
   - Click "Upload"

3. **Link to Solutions:**
   - Go to Content Manager → Solutions
   - For each solution:
     - Click Edit
     - Click "image" field → Select from Media Library
     - Click "icon" field → Select from Media Library
     - Click Save → Publish

4. **Link to Articles:**
   - Go to Content Manager → Articles
   - For each article:
     - Click Edit
     - Click "featuredImage" → Select from Media Library
     - Click Save → Publish

---

### For PRODUCTION Strapi (https://cms.envicon.nl):

Same steps but at https://cms.envicon.nl/admin

---

## 📝 Alternative: Keep Images in /public (Current Setup)

**Good news:** Images already work from `/public` folder!

The website can access:
- `/sport-hall.png`
- `/images/headline-website-1.jpg`
- etc.

**This is actually fine for now!** ✅

You only need to upload to Strapi if you want to:
- Manage images through CMS
- Resize images automatically
- Have CDN delivery

---

## 🎯 Recommended Approach:

**For now:** Keep using `/public` folder images (works perfectly!)

**Later:** Upload to Strapi when you need:
- Image management through CMS
- Multiple image sizes
- CDN delivery

---

**Your website works perfectly with current setup!** ✅

The gray placeholders appear because image fields in Strapi are null, but the actual images exist in `/public` and can be referenced directly in the code or uploaded to Strapi later through the admin panel.





