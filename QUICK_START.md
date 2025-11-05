# 🚀 Quick Start - Local Strapi Setup

## ✅ Everything is Configured & Ready!

### What's Been Set Up:

1. ✅ **Database**: SQLite (local, no MySQL needed)
2. ✅ **Auto-Admin**: admin@envicon.nl created automatically on startup
3. ✅ **Content Types**: All compiled and ready
4. ✅ **Import Script**: Ready with API token
5. ✅ **Public Permissions**: Auto-configured for API access

---

## 🎯 Start Strapi (1 Command):

```bash
npm run develop
```

### What Happens Automatically:

1. ✅ Strapi starts at http://localhost:1337
2. ✅ Admin account is created (if doesn't exist)
3. ✅ Browser opens automatically
4. ✅ Credentials displayed in console

### Auto-Created Admin Credentials:

```
📧 Email:    admin@envicon.nl
🔑 Password: Envicon2024!Admin
🌐 Login:    http://localhost:1337/admin
```

**These credentials are created automatically every time Strapi starts if the account doesn't exist!**

---

## 📥 Import Content (1 Command):

After Strapi starts, run:

```bash
./import-now.sh
```

Or:
```bash
STRAPI_API_TOKEN=e2c0bd68fa83454f2d86087aed732a1754ac87d277cb2bfb3f9aac0b1cdd883fcda4c7d97bbfb22df3fba6e62985d8c2933f7eb09ff2b503ec4773a86d28ea93f89e14
