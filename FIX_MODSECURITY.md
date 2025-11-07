# Fix ModSecurity Blocking Strapi Upload Plugin

## Problem

ModSecurity (COMODO WAF) is blocking Strapi's upload API requests with 403 errors because it detects MongoDB query operators (`$and`, `$eq`, etc.) as SQL injection attempts.

**Error:**
```
ModSecurity: Access denied with code 403 (phase 2)
Pattern match: MongoDB SQL injection attempts
Rule ID: 211760
URI: /upload/files?filters[$and][0][folderPath][$eq]=/
```

This is a **false positive** - Strapi legitimately uses these operators for filtering.

---

## Solution Options

### Option 1: Disable ModSecurity Rule for Strapi (Recommended)

**In Plesk:**

1. Go to **Domains** → **cms.envicon.nl** → **Apache & nginx Settings**
2. Click **Additional directives for httpd.conf**
3. Add this configuration:

```apache
<IfModule mod_security2.c>
    # Disable COMODO WAF rule 211760 for Strapi upload endpoints
    <LocationMatch "^/upload">
        SecRuleRemoveById 211760
    </LocationMatch>
    
    # Also disable for API endpoints that use MongoDB operators
    <LocationMatch "^/api">
        SecRuleRemoveById 211760
    </LocationMatch>
</IfModule>
```

4. Click **OK** to save
5. Restart Apache (or wait for Plesk to apply)

**Or via SSH (if you have access):**

```bash
# Edit Apache config for your domain
sudo nano /etc/apache2/conf.d/cms.envicon.nl.conf

# Add the configuration above

# Restart Apache
sudo systemctl restart apache2
```

---

### Option 2: Whitelist MongoDB Operators in ModSecurity

**In Plesk:**

1. Go to **Domains** → **cms.envicon.nl** → **Apache & nginx Settings**
2. Click **Additional directives for httpd.conf**
3. Add:

```apache
<IfModule mod_security2.c>
    # Whitelist Strapi query parameters
    SecRule ARGS_NAMES "@rx ^filters\[" \
        "id:1001,\
        phase:1,\
        pass,\
        nolog,\
        ctl:ruleRemoveById=211760"
</IfModule>
```

---

### Option 3: Disable ModSecurity Entirely for Strapi Domain (Not Recommended)

**Only use if other options don't work:**

```apache
<IfModule mod_security2.c>
    SecRuleEngine Off
</IfModule>
```

**Warning:** This disables all ModSecurity protection for the domain.

---

### Option 4: Configure ModSecurity Exception in Plesk

**In Plesk:**

1. Go to **Tools & Settings** → **Security** → **ModSecurity**
2. Click **ModSecurity Rules**
3. Find rule **211760** (COMODO WAF MongoDB detection)
4. Click **Edit** or **Disable** for your domain
5. Or add exception for `/upload` and `/api` paths

---

## Quick Fix Script

Create a file `fix-modsecurity.sh`:

```bash
#!/bin/bash

echo "🔧 Fixing ModSecurity for Strapi..."

# Path to Apache config (adjust for your Plesk setup)
CONFIG_FILE="/etc/apache2/conf.d/cms.envicon.nl.conf"

# Backup config
if [ -f "$CONFIG_FILE" ]; then
    cp "$CONFIG_FILE" "${CONFIG_FILE}.backup.$(date +%Y%m%d)"
    echo "✅ Backup created"
fi

# Add ModSecurity exception
cat >> "$CONFIG_FILE" << 'EOF'

# Strapi ModSecurity Exception
<IfModule mod_security2.c>
    <LocationMatch "^/(upload|api)">
        SecRuleRemoveById 211760
    </LocationMatch>
</IfModule>
EOF

echo "✅ ModSecurity configuration added"
echo "🔄 Restarting Apache..."
sudo systemctl restart apache2

echo "✅ Done! ModSecurity should now allow Strapi queries."
```

---

## Verification

After applying the fix:

1. **Check Apache config:**
   ```bash
   sudo apache2ctl configtest
   ```

2. **Test upload endpoint:**
   ```bash
   curl "https://cms.envicon.nl/upload/files?page=1&filters[\$and][0][folderPath][\$eq]=/"
   ```
   Should return 200 OK instead of 403.

3. **Check Strapi admin:**
   - Go to `https://cms.envicon.nl/admin/plugins/upload`
   - Should load without 403 errors
   - Try uploading a file

---

## Alternative: Use Nginx Reverse Proxy

If ModSecurity continues to cause issues, you can bypass it by using Nginx as a reverse proxy:

**In Plesk Nginx Settings:**

```nginx
location /upload {
    proxy_pass http://localhost:1337;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /api {
    proxy_pass http://localhost:1337;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Troubleshooting

### Still Getting 403 Errors

1. **Check if ModSecurity is active:**
   ```bash
   apache2ctl -M | grep security
   ```

2. **Check Apache error logs:**
   ```bash
   tail -f /var/log/apache2/error.log | grep ModSecurity
   ```

3. **Verify rule is disabled:**
   ```bash
   grep -r "211760" /etc/apache2/
   ```

### Apache Won't Start

1. **Test configuration:**
   ```bash
   sudo apache2ctl configtest
   ```

2. **Check syntax errors:**
   ```bash
   sudo apache2ctl -t
   ```

3. **Restore backup if needed:**
   ```bash
   cp /etc/apache2/conf.d/cms.envicon.nl.conf.backup.* /etc/apache2/conf.d/cms.envicon.nl.conf
   ```

---

## Summary

**Quickest Fix (Option 1):**

Add to Plesk → Domains → cms.envicon.nl → Apache & nginx Settings → Additional directives:

```apache
<IfModule mod_security2.c>
    <LocationMatch "^/(upload|api)">
        SecRuleRemoveById 211760
    </LocationMatch>
</IfModule>
```

Then restart Apache. This disables the problematic rule only for Strapi endpoints while keeping protection for the rest of your site.

---

## Related Issues

This fix also resolves:
- ✅ 403 errors when accessing `/api/*` endpoints with filters
- ✅ Media library not loading files
- ✅ Content Manager filtering issues
- ✅ Any Strapi API calls using MongoDB operators

