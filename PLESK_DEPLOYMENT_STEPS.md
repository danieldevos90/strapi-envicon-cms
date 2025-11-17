# 🚀 Plesk Deployment Steps - Strapi CMS

## ✅ Git Push Completed

**Repository**: https://github.com/danieldevos90/strapi-envicon-cms.git  
**Commit**: `14f0373` - Complete Strapi CMS production setup for Plesk deployment  
**Status**: Ready for deployment

---

## 📋 Plesk Deployment Checklist

### 1. On Plesk Server
```bash
# Navigate to your domain directory
cd /var/www/vhosts/yourdomain.com/

# Clone or pull the repository
git clone https://github.com/danieldevos90/strapi-envicon-cms.git strapi-cms
# OR if already exists:
cd strapi-cms && git pull origin main

# Install dependencies
npm install

# Build for production
npm run build
```

### 2. Environment Configuration
Create `.env` file with production settings:
```env
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys_here
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database (if using MySQL/PostgreSQL)
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi_envicon
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
```

### 3. Start Strapi
```bash
# Using PM2 (recommended)
pm2 start npm --name "strapi-cms" -- start
pm2 save
pm2 startup

# OR direct start
npm start
```

### 4. Configure Admin & API Access
1. **Access Strapi Admin**: `https://yourdomain.com:1337/admin`
2. **Login**: admin@envicon.nl / Envicon2024!Admin
3. **Create API Token**:
   - Go to Settings → API Tokens
   - Create new token: "content-population"
   - Type: Full Access
   - Copy the token

### 5. Populate Content
```bash
# Set the API token and populate content
STRAPI_API_TOKEN=your_token_here node populate-content-from-checklist.js
```

---

## 🔍 Verification Steps

### Check Build Status
```bash
npm run verify
```

### Test API Endpoints
After content population, these should work:
- `https://yourdomain.com:1337/api/homepage`
- `https://yourdomain.com:1337/api/services`
- `https://yourdomain.com:1337/api/sectors`
- `https://yourdomain.com:1337/api/about-page`
- `https://yourdomain.com:1337/api/contact-page`
- `https://yourdomain.com:1337/api/articles`
- `https://yourdomain.com:1337/api/projects`

### Content Verification
1. **Admin Panel**: All content types visible and editable
2. **API Responses**: Proper JSON responses with data
3. **Permissions**: Public read access working
4. **Media**: Upload functionality working

---

## 📦 What's Included

### Content Types Ready for Use
- ✅ **Services** (Modulair bouwen, Tijdelijke huisvesting)
- ✅ **Sectors** (Onderwijs, Wonen, Bouw & Industrie, Sport)
- ✅ **About Page** (Over ons)
- ✅ **Contact Page** 
- ✅ **Homepage** (Hero, sections)
- ✅ **Articles** (Blog posts)
- ✅ **Projects** (Case studies)

### Components Available
- ✅ **Text Block** - Reusable content blocks
- ✅ **Feature** - Feature blocks with icons
- ✅ **UI Components** - Buttons, social links
- ✅ **Section Components** - Hero, about, contact sections

### Scripts & Tools
- ✅ **setup-production-ready.js** - Complete setup automation
- ✅ **populate-content-from-checklist.js** - Content population
- ✅ **enable-public-access.js** - API permissions setup
- ✅ **get-api-token.js** - Token management

---

## 🔧 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### API 404 Errors
```bash
# Setup permissions
node setup-production-ready.js
```

### Content Not Showing
1. Check API token is correct
2. Verify content is published in admin
3. Run content population script again

### Permission Issues
```bash
# Reset permissions
node enable-public-access.js
```

---

## 🎯 Next Steps After Deployment

1. **Test Frontend Connection**: Update your Next.js app to use the new Strapi API
2. **Add Media**: Upload images for services, sectors, and projects
3. **Create Content**: Add more articles, projects, and case studies
4. **SEO Setup**: Configure meta tags and sitemaps
5. **Monitoring**: Set up logging and monitoring

---

## 📞 Support

**Repository**: https://github.com/danieldevos90/strapi-envicon-cms.git  
**Documentation**: See `DEPLOYMENT_READY.md` for detailed info  
**Admin Credentials**: admin@envicon.nl / Envicon2024!Admin (change after deployment)

---

**Status**: ✅ Ready for Plesk Deployment  
**Last Updated**: November 5, 2024  
**Commit**: 14f0373
