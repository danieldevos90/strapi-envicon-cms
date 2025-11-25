# Local Strapi CMS Setup Guide

This guide will help you set up and populate your local Strapi CMS with content from the SQL files.

## Prerequisites

- Node.js installed
- MySQL running locally (same database as used before)
- The SQL files (`content.sql` and `articles.sql`) are already in this directory

## Step-by-Step Setup

### 1. Install Dependencies (if not done already)

```bash
cd strapi-cms
npm install
```

### 2. Start Local Strapi

```bash
npm run develop
```

This will:
- Build the Strapi admin panel
- Start the server at `http://localhost:1337`
- Open your browser automatically

### 3. Create Admin Account

When Strapi starts for the first time, you'll see the admin registration page:

1. Go to `http://localhost:1337/admin/auth/register-admin`
2. Fill in the form:
   - **First Name:** Admin
   - **Last Name:** Envicon
   - **Email:** admin@envicon.nl (or your preferred email)
   - **Password:** Choose a strong password (min 8 characters)
3. Click "Let's start"

**Save these credentials!** You'll need them to log in.

### 4. Create API Token

To import the data, you need an API token:

1. Log in to Strapi admin at `http://localhost:1337/admin`
2. Go to **Settings** (⚙️ in the sidebar)
3. Under "Global Settings", click **API Tokens**
4. Click **Create new API Token**
5. Fill in:
   - **Name:** Import Script
   - **Description:** Token for importing SQL data
   - **Token duration:** Unlimited
   - **Token type:** Full access
6. Click **Save**
7. **Copy the token immediately** (it won't be shown again!)

### 5. Import Content from SQL Files

Now import all the content:

```bash
# Make sure you're in the strapi-cms directory
cd strapi-cms

# Run the import script with your API token
STRAPI_API_TOKEN=your_token_here node import-local.js
```

Replace `your_token_here` with the actual token you copied.

The script will import:
- ✅ Navigation
- ✅ SEO Settings
- ✅ Footer
- ✅ Forms Configuration
- ✅ Homepage (Hero, About, Contact, Process)
- ✅ 4 Solutions
- ✅ 3 Sectors
- ✅ 7 Services
- ✅ 4 Process Steps
- ✅ 3 Articles

### 6. Verify the Import

1. Go to `http://localhost:1337/admin`
2. Click **Content Manager** in the sidebar
3. Check the following sections:
   - **Single Types:** Homepage, Navigation, Footer, Forms Config, SEO Config
   - **Collection Types:** Articles, Solutions, Sectors, Services, Process Steps

All content should be there and published!

### 7. Upload Images (Optional)

The import script doesn't upload images. To add them:

1. Go to **Media Library** in Strapi admin
2. Upload the images from your `/public` folder
3. Edit the Solutions and Articles to link the uploaded images

## Useful Commands

```bash
# Start Strapi in development mode
npm run develop

# Build Strapi for production
npm run build

# Start Strapi in production mode
npm start

# Stop Strapi
# Press Ctrl+C in the terminal
```

## Troubleshooting

### Error: "Database connection failed"

Make sure MySQL is running and the credentials in `.env` are correct:
```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=envicoadmi_
DATABASE_USERNAME=admin_envicon
DATABASE_PASSWORD=Envicon12#
```

### Error: "Strapi API error: 401"

Your API token is invalid or expired. Create a new one in Strapi admin.

### Error: "Module not found"

Run `npm install` to install all dependencies.

### Content already exists

If you run the import script multiple times, it will skip items that already exist (based on slug for articles).

## Admin Credentials Reference

After setup, keep these handy:

- **Admin Panel:** http://localhost:1337/admin
- **Email:** (the email you used during registration)
- **Password:** (the password you chose)
- **API Token:** (save it somewhere secure)

## Next Steps

After import:
1. Review all content in Strapi admin
2. Upload images to Media Library
3. Link images to Solutions and Articles
4. Test the local website at http://localhost:3000
5. Make sure the website pulls data from local Strapi

---

**Need help?** Check the logs in the terminal or the Strapi documentation at https://docs.strapi.io

