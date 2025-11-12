# Strapi Homepage Verification Checklist

After making schema changes, verify the homepage structure in Strapi Admin at: https://cms.envicon.nl/admin/content-manager/single-types/api::homepage.homepage

## Required Steps After Schema Changes

1. **Restart Strapi CMS** - Schema changes require a restart
2. **Rebuild Strapi** (if needed) - Run `npm run build` in strapi-cms directory
3. **Clear Cache** - Clear browser cache or use incognito mode
4. **Check Component Registration** - Verify all components are registered

## Expected Homepage Fields

The homepage should have these **11 component fields**:

1. ✅ **hero** - Component: `sections.hero`
2. ✅ **about** - Component: `sections.about`
3. ✅ **intro** - Component: `sections.intro`
4. ✅ **gallery** - Component: `sections.gallery`
5. ✅ **solutions** - Component: `sections.solutions-section`
6. ✅ **articles** - Component: `sections.articles-section`
7. ✅ **sectors** - Component: `sections.sectors-section`
8. ✅ **process** - Component: `sections.process-section`
9. ✅ **services** - Component: `sections.services-section`
10. ✅ **benefits** - Component: `sections.benefits-section` (NEW - added recently)
11. ✅ **contact** - Component: `sections.contact`

## Component Field Details

### Hero Section (`sections.hero`)
**Fields:**
- `title` (string, required)
- `subtitle` (string, required)
- `description` (text, required)
- `carousel` (JSON) - Store as: `["/path/to/image1.jpg", "/path/to/image2.jpg"]`
- `videoUrl` (string, optional)
- `buttons` (JSON) - See STRAPI_HOMEPAGE_FIELDS.md for structure

### About Section (`sections.about`)
**Fields:**
- `subtitle` (string, required)
- `title` (string, required)
- `description` (text, required)
- `features` (repeatable component: `ui.feature`)
  - `icon` (enumeration: check, settings, volume2, building, shield, clock, star, heart)
  - `title` (string, required)
  - `description` (text, required)

### Intro Section (`sections.intro`)
**Fields:**
- `title` (string, required)
- `description` (text, optional)
- `buttonText` (string, optional)
- `buttonHref` (string, optional)
- `images` (media, multiple, max 3)
- `imageAltTexts` (JSON) - Store as: `["Alt text 1", "Alt text 2", "Alt text 3"]`

### Gallery Section (`sections.gallery`)
**Fields:**
- `images` (media, multiple, max 3)
- `imageAltTexts` (JSON) - Store as: `["Alt text 1", "Alt text 2", "Alt text 3"]`

### Benefits Section (`sections.benefits-section`) - NEW
**Fields:**
- `title` (string, required)
- `subtitle` (text, optional)
- `benefits` (repeatable component: `ui.feature`)
  - `icon` (enumeration: check, settings, volume2, building, shield, clock, star, heart)
  - `title` (string, required)
  - `description` (text, required)

### Contact Section (`sections.contact`)
**Fields:**
- `title` (string, required)
- `subtitle` (string, required)
- `description` (text, required)
- `methods` (repeatable component: `ui.contact-method`)
- `map` (JSON, optional)
- `buttons` (JSON) - Store as: `{"quote": {"text": "Vraag offerte aan", "href": "/offerte-aanvragen"}}`

## Troubleshooting

### If fields are missing:
1. Check if Strapi was restarted after schema changes
2. Verify component files exist in `src/components/sections/`
3. Check component names match exactly (case-sensitive)
4. Rebuild Strapi: `cd strapi-cms && npm run build`

### If component doesn't appear:
1. Verify the component JSON file exists
2. Check the component name matches: `sections.{component-name}`
3. Ensure the component is properly formatted JSON
4. Restart Strapi completely

### If data doesn't display:
1. Check API permissions (Settings → Roles → Public)
2. Verify content is published (not draft)
3. Check browser console for API errors
4. Verify populate query in `utils/strapi.js`

## Component Name Mapping

| Schema Reference | Component File | Display Name |
|-----------------|----------------|--------------|
| `sections.hero` | `sections/hero.json` | Hero Section |
| `sections.about` | `sections/about.json` | About Section |
| `sections.intro` | `sections/intro.json` | Intro Section |
| `sections.gallery` | `sections/gallery.json` | Gallery Section |
| `sections.solutions-section` | `sections/solutions-section.json` | Solutions Section |
| `sections.articles-section` | `sections/articles-section.json` | Articles Section |
| `sections.sectors-section` | `sections/sectors-section.json` | Sectors Section |
| `sections.process-section` | `sections/process-section.json` | Process Section |
| `sections.services-section` | `sections/services-section.json` | Services Section |
| `sections.benefits-section` | `sections/benefits-section.json` | Benefits Section |
| `sections.contact` | `sections/contact.json` | Contact Section |

## Next Steps

1. **Restart Strapi** on the server
2. **Verify** all 11 fields appear in Strapi Admin
3. **Fill in content** for each section
4. **Publish** the homepage
5. **Test** the frontend to see if content displays correctly

