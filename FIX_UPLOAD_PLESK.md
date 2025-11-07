# Fix Strapi Upload Plugin on Plesk

## Common Issues

The Strapi upload plugin (`/admin/plugins/upload`) not working on Plesk is usually caused by:

1. **File Permissions** - Uploads directory needs write permissions
2. **Nginx Upload Limits** - File size restrictions
3. **Strapi Body Parser Limits** - Request size limits
4. **Missing Directory Structure** - Uploads folder not created

---

## Solution Steps

### Step 1: Fix File Permissions

**Via SSH on Plesk:**

```bash
# Navigate to your Strapi directory
cd /var/www/vhosts/envicon.nl/httpdocs/strapi-cms
# Or wherever your Strapi is located

# Create uploads directory if it doesn't exist
mkdir -p public/uploads

# Set correct permissions
chmod -R 755 public/
chmod -R 777 public/uploads

# Fix ownership (replace 'your-user' with your Plesk user)
chown -R your-user:psacln public/uploads
```

**Via Plesk File Manager:**
1. Navigate to `strapi-cms/public/`
2. Create `uploads` folder if it doesn't exist
3. Right-click `uploads` → **Change Permissions**
4. Set to: `777` (read, write, execute for all)
5. Check **Recursive** to apply to all subfolders

---

### Step 2: Configure Strapi Body Parser Limits

Update `config/middlewares.ts` to allow larger file uploads:

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb', // modify form body
      jsonLimit: '256mb', // modify JSON body
      textLimit: '256mb', // modify text body
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // 250mb in bytes
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

After updating, rebuild Strapi:
```bash
npm run build
pm2 restart strapi-cms
```

---

### Step 3: Configure Nginx Upload Limits

**In Plesk:**

1. Go to **Domains** → **cms.envicon.nl** → **Apache & nginx Settings**
2. Click **Additional nginx directives**
3. Add these directives:

```nginx
# Increase upload size limits
client_max_body_size 250M;
client_body_buffer_size 128k;

# Increase timeouts for large uploads
client_body_timeout 300s;
proxy_read_timeout 300s;
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
```

4. Click **OK** to save
5. Restart nginx (or wait for Plesk to apply changes)

**Or via SSH (if you have access to nginx config):**

```bash
# Edit nginx config for your domain
sudo nano /etc/nginx/conf.d/cms.envicon.nl.conf

# Add inside the server block:
client_max_body_size 250M;
client_body_buffer_size 128k;
client_body_timeout 300s;

# Restart nginx
sudo systemctl restart nginx
```

---

### Step 4: Configure PHP Upload Limits (if using PHP-FPM)

**In Plesk:**

1. Go to **Domains** → **cms.envicon.nl** → **PHP Settings**
2. Set these values:
   - `upload_max_filesize`: `250M`
   - `post_max_size`: `250M`
   - `max_execution_time`: `300`
   - `max_input_time`: `300`
   - `memory_limit`: `512M`

3. Click **OK** to save

**Or via SSH:**

Edit PHP configuration:
```bash
# Find PHP config file
php --ini

# Edit the php.ini file (usually in /etc/php/8.x/fpm/php.ini)
sudo nano /etc/php/8.x/fpm/php.ini

# Set these values:
upload_max_filesize = 250M
post_max_size = 250M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M

# Restart PHP-FPM
sudo systemctl restart php8.x-fpm
```

---

### Step 5: Verify Upload Directory Structure

Ensure the directory structure exists:

```bash
cd /path/to/strapi-cms
ls -la public/uploads/

# Should show:
# drwxrwxrwx uploads/
```

If missing, create it:
```bash
mkdir -p public/uploads
chmod 777 public/uploads
```

---

### Step 6: Configure Upload Plugin Settings

Create or update `config/plugins.ts`:

```typescript
export default {
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
      sizeLimit: 250 * 1024 * 1024, // 250mb in bytes
    },
  },
};
```

Rebuild after changes:
```bash
npm run build
pm2 restart strapi-cms
```

---

### Step 7: Test Upload

1. **Restart Strapi:**
   ```bash
   pm2 restart strapi-cms
   ```

2. **Check logs for errors:**
   ```bash
   pm2 logs strapi-cms --lines 50
   ```

3. **Try uploading:**
   - Go to `https://cms.envicon.nl/admin/plugins/upload`
   - Click **Add new assets**
   - Try uploading a small image first (< 1MB)
   - Then try larger files

---

## Troubleshooting

### Error: "413 Request Entity Too Large"

**Solution:** Increase nginx `client_max_body_size` (Step 3)

### Error: "Permission denied" or "EACCES"

**Solution:** Fix file permissions (Step 1)

### Error: "File too large"

**Solution:** Increase Strapi body parser limits (Step 2)

### Uploads folder not found

**Solution:** Create directory structure (Step 5)

### Upload works but files disappear

**Solution:** Check file permissions and ownership (Step 1)

---

## Quick Fix Script

Create a file `fix-uploads.sh`:

```bash
#!/bin/bash

# Navigate to Strapi directory
cd /var/www/vhosts/envicon.nl/httpdocs/strapi-cms

# Create uploads directory
mkdir -p public/uploads

# Fix permissions
chmod -R 755 public/
chmod -R 777 public/uploads

# Fix ownership (replace with your user)
chown -R your-user:psacln public/uploads

echo "✅ Upload directory permissions fixed!"
echo "📁 Location: $(pwd)/public/uploads"
echo "🔒 Permissions: $(ls -ld public/uploads)"
```

Run it:
```bash
chmod +x fix-uploads.sh
./fix-uploads.sh
```

---

## Verification Checklist

After applying fixes, verify:

- [ ] `public/uploads/` directory exists
- [ ] Permissions are `777` on uploads folder
- [ ] Nginx `client_max_body_size` is set to `250M` or higher
- [ ] PHP `upload_max_filesize` is set to `250M` or higher
- [ ] Strapi body parser limits are configured
- [ ] Strapi has been rebuilt and restarted
- [ ] No errors in Strapi logs when accessing upload page

---

## Still Not Working?

1. **Check Strapi logs:**
   ```bash
   pm2 logs strapi-cms --lines 100
   ```

2. **Check nginx error logs:**
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. **Test directory write access:**
   ```bash
   cd /path/to/strapi-cms/public/uploads
   touch test.txt
   echo "test" > test.txt
   rm test.txt
   ```

4. **Verify Strapi is running:**
   ```bash
   pm2 list
   curl https://cms.envicon.nl/admin
   ```

---

## Summary

Most common fix is **Step 1 (File Permissions)**. Start there, then move to Step 2 (Strapi config) and Step 3 (Nginx limits) if needed.

**Quickest fix:**
```bash
cd /path/to/strapi-cms
mkdir -p public/uploads
chmod -R 777 public/uploads
pm2 restart strapi-cms
```

