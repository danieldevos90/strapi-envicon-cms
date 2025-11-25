# Simple Fix: Disable ModSecurity via Plesk UI (No SSH/Config Changes)

## Simplest Solution - 2 Minutes

### Option 1: Disable ModSecurity for Strapi Domain (Easiest)

**In Plesk Web Interface:**

1. **Login to Plesk**
2. Go to **Domains** → **cms.envicon.nl**
3. Click **Security** (or **ModSecurity**)
4. **Uncheck** "Enable ModSecurity" or click **Disable**
5. Click **OK**

That's it! No SSH, no config files, no code changes.

---

### Option 2: Disable Specific Rule via Plesk

If you want to keep ModSecurity but disable only the problematic rule:

1. **Login to Plesk**
2. Go to **Tools & Settings** → **Security** → **ModSecurity**
3. Find rule **211760** (COMODO WAF MongoDB detection)
4. Click **Disable** or **Remove** for your domain
5. Click **OK**

---

### Option 3: Add Exception via Plesk (If Available)

Some Plesk versions have a ModSecurity exceptions interface:

1. **Login to Plesk**
2. Go to **Domains** → **cms.envicon.nl** → **Security**
3. Look for **ModSecurity Exceptions** or **Whitelist**
4. Add exception for:
   - **Path:** `/upload`
   - **Path:** `/api`
5. Click **OK**

---

## That's It!

No SSH access needed. No config file editing. Just use Plesk's web interface.

After disabling ModSecurity, restart Apache (Plesk usually does this automatically) and try the upload plugin again.

---

## Why This Works

ModSecurity is blocking Strapi's legitimate MongoDB query operators. Disabling it for the Strapi domain (or just the problematic rule) allows Strapi to work normally while keeping protection on other domains.

---

## Still Having Issues?

If ModSecurity options aren't visible in your Plesk version, contact your hosting provider and ask them to:
- Disable ModSecurity rule 211760 for cms.envicon.nl
- Or disable ModSecurity entirely for cms.envicon.nl

They can do this from their side without you needing to change anything.

