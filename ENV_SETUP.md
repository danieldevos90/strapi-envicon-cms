# Environment Variables Setup Guide

## Quick Check

Run this command to check if all required environment variables are set:

```bash
npm run check-env
```

This will show:
- ✅ Which variables are present
- ❌ Which variables are missing
- Values (with sensitive data masked)

## Generate Missing Secrets

If you need to generate the security keys (APP_KEYS, JWT_SECRET, etc.):

```bash
npm run generate-secrets
```

Copy the output and add it to your `.env` file.

## Required Environment Variables

### Application Settings
```
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
```

### Security Keys (generate with `npm run generate-secrets`)
```
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

### Database Configuration
```
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=your_database_name
DATABASE_USERNAME=your_database_user
DATABASE_PASSWORD=your_database_password
DATABASE_SSL=false
```

## Troubleshooting in Plesk

### If `.env` file is not being loaded:

1. **Option 1**: Set variables in Plesk UI
   - Go to: Node.js settings → Custom environment variables → specify
   - Add all required variables there

2. **Option 2**: Verify `.env` file location
   - File must be in: `/var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/.env`
   - Check file permissions: `chmod 600 .env`

### Run these commands in Plesk:

1. **Check environment variables**:
   ```bash
   npm run check-env
   ```

2. **Build Strapi**:
   ```bash
   npm run build
   ```

3. **Start Strapi**:
   ```bash
   npm start
   ```

## Complete Setup Steps

1. Upload `.env` file to server
2. Run `npm run check-env` to verify
3. If secrets are missing, run `npm run generate-secrets`
4. Run `npm run build`
5. Restart app in Plesk
6. Check https://cms.envicon.nl

## Exit Codes

- **Exit 0**: All required variables are set ✅
- **Exit 1**: Some required variables are missing ❌

