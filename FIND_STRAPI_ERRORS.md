# Finding Strapi Error Logs

## Current Logs Shown

The logs you showed are **Passenger connection management messages**, not actual errors. These are just informational messages about checking connections.

## Where to Find Actual Errors

### 1. Strapi Application Logs (Most Likely)

Strapi logs errors to files in its own directory:

**Via Plesk File Manager:**
1. Go to **Files** → **File Manager**
2. Navigate to: `/var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs`
3. Look for `logs/` folder
4. Check these files:
   - `strapi.log`
   - `strapi-output.log`
   - `strapi-startup.log`
   - Any `.log` files

**Or check if logs are in a different location:**
- `strapi-cms/logs/`
- `logs/strapi.log`
- `.strapi/logs/`

### 2. Node.js Application Output

**Via Plesk:**
1. Go to **Domains** → **cms.envicon.nl** → **Node.js**
2. Look for **"View Logs"** or **"Application Logs"** button
3. This shows Node.js console output where Strapi errors appear

### 3. Enable Verbose Logging

If logs aren't showing errors, enable verbose logging:

**Edit `.env` file:**
```
LOG_LEVEL=debug
```

Then restart Strapi and try creating an article again. Errors will be more verbose.

### 4. Check Real-Time Logs

**Via Plesk Node.js:**
1. Go to **Domains** → **cms.envicon.nl** → **Node.js**
2. Look for **"Terminal"** or **"Console"** option
3. This shows real-time output

Or check if there's a way to view live logs in Plesk.

## Alternative: Test via Admin Panel

Since we can't find the logs easily, test via admin panel:

1. Go to `https://cms.envicon.nl/admin`
2. **Content Manager** → **Articles** → **Create new entry**
3. Fill in:
   - Title: "Test Article"
   - Slug: "test-article"
   - Excerpt: "Test excerpt"
   - Content: "<p>Test</p>"
4. Leave `publishedAt` empty
5. Click **Save**

**The admin panel will show the error message directly** if there's a validation or database issue!

## Quick Check Commands

If you have SSH access:

```bash
# Find Strapi log files
find /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs -name "*.log" -type f

# Check recent errors
grep -r "error\|Error\|ERROR" /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/logs/ 2>/dev/null | tail -20

# Check Strapi output
tail -100 /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/logs/strapi*.log 2>/dev/null
```

## Most Important: Admin Panel Test

**Try creating an article in the admin panel** - it will show you the exact error message if there's a validation or database issue. This is often easier than finding log files!

