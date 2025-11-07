# Simple Fix When ModSecurity Not in Plesk

## The Problem

ModSecurity is blocking Strapi's upload API, but you can't disable it through Plesk because it's managed at the server level.

---

## Simplest Solution: Contact Your Hosting Provider

**Just ask them to:**

1. **Disable ModSecurity rule 211760** for `cms.envicon.nl`
   - OR
2. **Disable ModSecurity entirely** for `cms.envicon.nl`

**What to tell them:**
> "ModSecurity rule 211760 is blocking legitimate Strapi CMS API requests. Can you please disable this rule for the domain cms.envicon.nl? The rule is blocking MongoDB query operators that Strapi uses for filtering."

They can do this in seconds from their side - no changes needed from you!

---

## Alternative: Try .htaccess File

If your hosting allows `.htaccess` overrides, create this file:

**File:** `public/.htaccess` (in your Strapi `public` folder)

```apache
<IfModule mod_security2.c>
    SecRuleRemoveById 211760
</IfModule>
```

**Steps:**
1. Go to Plesk → **File Manager**
2. Navigate to `strapi-cms/public/`
3. Create new file: `.htaccess`
4. Paste the code above
5. Save

**Note:** This only works if Apache allows ModSecurity overrides (many hosts disable this for security).

---

## Check If .htaccess Works

After creating `.htaccess`:

1. Try accessing: `https://cms.envicon.nl/admin/plugins/upload`
2. Check if 403 errors are gone
3. If still blocked, `.htaccess` overrides are disabled → contact provider

---

## Why Contact Provider is Best

- ✅ No code changes needed
- ✅ No config files to manage
- ✅ They can do it instantly
- ✅ Proper solution (not a workaround)

---

## What They Need to Do

**Server admin command:**
```bash
# Option 1: Disable rule for specific domain
# Add to Apache vhost config:
<IfModule mod_security2.c>
    <VirtualHost *:443>
        ServerName cms.envicon.nl
        SecRuleRemoveById 211760
    </VirtualHost>
</IfModule>

# Option 2: Disable ModSecurity for domain
SecRuleEngine Off
```

**Or via Plesk (if they have access):**
- Tools & Settings → Security → ModSecurity
- Disable rule 211760 for cms.envicon.nl

---

## Summary

**Simplest path:**
1. Contact hosting provider
2. Ask them to disable ModSecurity rule 211760 for cms.envicon.nl
3. Done!

**If you want to try yourself:**
1. Create `public/.htaccess` with the code above
2. Test if it works
3. If not → contact provider

No other changes needed!

