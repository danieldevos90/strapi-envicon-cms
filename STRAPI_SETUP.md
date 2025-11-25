# Strapi CMS Setup Guide

## 1. Database Configuration

Strapi will use the same MySQL database as your Next.js application. 

### Setup Steps:

1. **Copy environment variables:**
```bash
cd strapi-cms
cp .env.example .env
```

2. **Update `.env` with your database credentials:**
- Copy the `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` from your parent Next.js `.env` file
- Update the DATABASE_* variables in strapi-cms/.env

3. **Generate secrets (run from strapi-cms directory):**
```bash
npm run generate-secrets
```

## 2. Install Dependencies

```bash
cd strapi-cms
npm install
```

## 3. Build Strapi

```bash
npm run build
```

## 4. Run Migrations

Import existing data from content.sql and articles.sql:

```bash
node migrate-data.js
```

## 5. Start Strapi

### Development:
```bash
npm run develop
```

### Production:
```bash
npm run build
npm start
```

## 6. Create Admin User

On first run, navigate to http://localhost:1337/admin and create your admin account.

## 7. Configure API Permissions

1. Go to Settings → Roles → Public
2. Enable the following permissions:
   - Article: find, findOne
   - Solution: find, findOne
   - Sector: find, findOne
   - Service: find, findOne
   - Process-step: find, findOne
   - Homepage: find
   - Navigation: find
   - SEO Settings: find
   - Footer: find
   - Forms Config: find

## Content Structure

### Single Types (Global Content)
- **Navigation** - Site navigation menu
- **SEO Settings** - Global SEO configuration
- **Footer** - Footer content
- **Forms Config** - Form configurations
- **Homepage** - Homepage sections

### Collection Types (Repeatable Content)
- **Articles** - Blog posts and news
- **Solutions** - Building solutions (Demontabel, Overkapping, etc.)
- **Sectors** - Industry sectors
- **Services** - Services offered
- **Process Steps** - Build process steps

### Components
- **UI Components**: Logo, Menu Item, Button, Feature, etc.
- **Section Components**: Hero, About, Contact, Process Section

## Next.js Integration

After Strapi is running, update your Next.js app to fetch from Strapi:

```javascript
// Example: Fetch navigation
const response = await fetch('http://localhost:1337/api/navigation?populate=*');
const data = await response.json();
```

See the migration guide in the parent directory for more details.

