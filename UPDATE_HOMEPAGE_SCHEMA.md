# Update Homepage Schema on Production Server

## Problem
The Strapi admin interface at https://cms.envicon.nl/admin/content-manager/single-types/api::homepage.homepage still shows old sections and fields, even though the schema files have been updated in git.

## Solution: Update Strapi on Production Server

### Step 1: Pull Latest Changes
```bash
cd /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs
cd strapi-cms
git pull origin main
```

### Step 2: Rebuild Strapi
Strapi needs to be rebuilt to compile the new schema changes:
```bash
npm run build
```

This will:
- Compile TypeScript/JavaScript files
- Process all schema files
- Register new components
- Update content types

### Step 3: Restart Strapi
After rebuilding, restart Strapi:
```bash
npm run restart
# OR
pm2 restart strapi-cms
# OR
systemctl restart strapi-cms
```

### Step 4: Verify Schema Changes
1. Go to https://cms.envicon.nl/admin/content-manager/single-types/api::homepage.homepage
2. Check that all 11 component fields appear:
   - hero
   - about
   - intro
   - gallery
   - solutions
   - articles
   - sectors
   - process
   - services
   - benefits (NEW)
   - contact

### Step 5: Check Component Registration
1. Go to Content-Type Builder
2. Verify all components exist:
   - `sections.hero`
   - `sections.about`
   - `sections.intro`
   - `sections.gallery`
   - `sections.solutions-section`
   - `sections.articles-section`
   - `sections.sectors-section`
   - `sections.process-section`
   - `sections.services-section`
   - `sections.benefits-section` (NEW)
   - `sections.contact`
   - `ui.feature` (with enumeration icon field)
   - `ui.contact-method` (with type enumeration)

## Troubleshooting

### If fields still don't appear:
1. **Clear Strapi cache:**
   ```bash
   rm -rf .cache
   rm -rf dist
   npm run build
   ```

2. **Check for errors in build output:**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

3. **Verify component files exist:**
   ```bash
   ls -la src/components/sections/
   ls -la src/components/ui/
   ```

4. **Check Strapi logs:**
   ```bash
   pm2 logs strapi-cms
   # OR
   tail -f logs/strapi.log
   ```

### If components are missing:
1. Verify all component JSON files are present
2. Check JSON syntax is valid (no trailing commas, etc.)
3. Ensure component names match exactly (case-sensitive)

### If build fails:
1. Check Node.js version: `node --version` (should be 18-22)
2. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## Expected Schema Structure

After successful update, the homepage should have:

**11 Component Fields:**
1. hero (sections.hero)
2. about (sections.about)
3. intro (sections.intro)
4. gallery (sections.gallery)
5. solutions (sections.solutions-section)
6. articles (sections.articles-section)
7. sectors (sections.sectors-section)
8. process (sections.process-section)
9. services (sections.services-section)
10. benefits (sections.benefits-section) ← NEW
11. contact (sections.contact)

**Component Updates:**
- `ui.feature` - icon field is now enumeration (not string)
- `ui.contact-method` - has type enumeration, label instead of title

## Quick Update Command

If you have SSH access, run this single command:
```bash
cd /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/strapi-cms && \
git pull origin main && \
npm run build && \
npm run restart
```

## Important Notes

- **Backup first:** Consider backing up the database before schema changes
- **Downtime:** There may be brief downtime during rebuild/restart
- **Content:** Existing content won't be lost, but you may need to reconfigure fields
- **Permissions:** After restart, verify API permissions are still set correctly

