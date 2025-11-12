# 🔐 Local Strapi Admin Credentials

## Auto-Created Admin Account

When you start Strapi locally (`npm run develop`), the admin account is **automatically created** if it doesn't exist.

### Default Credentials:

```
Email:    admin@envicon.nl
Password: Envicon2024!Admin
Login:    http://localhost:1337/admin
```

## Important Notes:

1. ✅ **Automatic Creation**: This account is created automatically on first startup
2. ✅ **Always Available**: If deleted, it will be recreated on next restart
3. ⚠️  **Local Only**: This only works for local development with SQLite
4. 🔒 **Change Password**: Recommended to change the password after first login
5. 🎯 **Super Admin**: Has full access to all Strapi features

## API Token:

Your current API token for imports:
```
e2c0bd68fa83454f2d86087aed732a1754ac87d277cb2bfb3f9aac0b1cdd883fcda4c7d97bbfb22df3fba6e62985d8c2933f7eb09ff2b503ec4773a86d28ea93f89e14ed3575632d1a80ff86be35e733727362a727905a64f1b4a28f02cb6da6ab877cc1b8b3622fafdfd3f67f9f452fbf446b208b0a9c76927faeafa3768497
```

## What Happens on Startup:

When you run `npm run develop`, Strapi will:

1. ✅ Check if admin@envicon.nl exists
2. ✅ If not, create it automatically
3. ✅ Set up public API permissions
4. ✅ Display credentials in the console

## First Time Setup:

```bash
cd strapi-cms
npm run develop
```

The console will show:
```
✅ Default admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:    admin@envicon.nl
🔑 Password: Envicon2024!Admin
🌐 Login:    http://localhost:1337/admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Changing the Password:

1. Log in at http://localhost:1337/admin
2. Click your profile icon (top right)
3. Go to "Profile"
4. Update your password
5. Save

## If Account Gets Deleted:

Don't worry! Just:
1. Stop Strapi (Ctrl+C)
2. Start it again: `npm run develop`
3. The




