# Strapi Content Types Fix - Quick Reference Card

## 🚨 The Problem
Content types not showing in Strapi admin permissions panel on Plesk.

## 🎯 Quick Fix (5 minutes)

```bash
cd /path/to/strapi-cms
npm run quick-fix
npm run verify
npm run restart
```

## ✅ Verify It Worked

Check admin panel: **Settings** → **Roles** → **Permissions**

Should see:
- Article
- Homepage
- Footer
- Navigation
- Envicon Seo Config
- Forms Config
- Process Step
- Sector
- Service
- Solution
- + Plugin permissions (Upload, Email, i18n, etc.)

## 📋 New Commands

| Command | What It Does |
|---------|--------------|
| `npm run build` | Complete build (TS + JS files) |
| `npm run verify` | Check build is complete |
| `npm run quick-fix` | Copy missing API files |

## 🔧 Troubleshooting

**Still not showing?**
```bash
npm run build
npm run verify
npm run restart
```

**Permission errors?**
```bash
sudo chown -R $USER:$USER .
chmod -R 755 .
chmod -R 777 public/uploads
```

**Node version issues?**
```bash
node -v  # Should be 18.x or 20.x
nvm use 20
```

## 📖 Full Documentation

- **Quick Instructions**: `FIX_PLESK_INSTRUCTIONS.md`
- **Detailed Guide**: `PLESK_DEPLOYMENT_FIX.md`
- **Complete Info**: `STRAPI_CONTENT_TYPES_FIX.md`

## 🆘 If Nothing Works

Collect diagnostic info:
```bash
npm run verify > verify.txt
pm2 logs strapi-cms --lines 100 > logs.txt
npm run check-env > env.txt
```

Then share these files.

---

**Remember**: Always run `npm run build && npm run verify` before deploying!





