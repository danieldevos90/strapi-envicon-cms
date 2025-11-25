# Check Logs to Find the Exact Error

## Available Logs in Plesk

Based on your log files, check these:

### 1. Apache Error Log (Most Likely)
**Path:** `logs/error_log` (52.4 KB, updated Nov 12)

This is where Strapi errors often appear. Check:
1. Go to **Logs** → **Error Log**
2. Look for recent errors (around the time you tried to create articles)
3. Look for errors mentioning:
   - `articles`
   - `publishedAt`
   - `500`
   - `Error`
   - `ValidationError`
   - `DatabaseError`

### 2. Passenger Log (Node.js Errors)
**Path:** `/var/log/passenger/passenger.log`

This shows Node.js/Strapi application errors:
1. Go to **Logs** → Look for Passenger logs
2. Or check via File Manager: `/var/log/passenger/passenger.log`
3. Look for errors with timestamps matching your article creation attempts

### 3. Strapi Application Logs (Best Option)
**Location:** In your Strapi directory

Check via **File Manager**:
1. Go to **Files** → **File Manager**
2. Navigate to your Strapi directory (usually `/var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs`)
3. Look for `logs/` folder
4. Check these files:
   - `strapi.log`
   - `strapi-output.log`
   - `strapi-startup.log`
   - Any `.log` files

## What to Look For

When you find the error, look for:

### Common Error Patterns:

1. **Validation Error:**
   ```
   ValidationError: publishedAt is required
   ```
   → Schema validation issue

2. **Database Error:**
   ```
   DatabaseError: Column 'publishedAt' cannot be null
   ```
   → Database constraint issue

3. **Field Error:**
   ```
   FieldError: Unknown field 'publishedAt'
   ```
   → Strapi doesn't recognize the column

4. **Type Error:**
   ```
   TypeError: Cannot read property...
   ```
   → Code issue

5. **Stack Trace:**
   ```
   at ArticleService.create (...)
   at ArticleController.create (...)
   ```
   → Shows where it's failing

## Quick Check Commands

If you have SSH access:

```bash
# Check Apache error log
tail -50 /var/www/vhosts/envicon.nl/cms.envicon.nl/logs/error_log

# Check Passenger log
tail -50 /var/log/passenger/passenger.log

# Check Strapi logs (if they exist)
tail -50 /var/www/vhosts/envicon.nl/cms.envicon.nl/httpdocs/logs/*.log
```

## Most Important: Apache Error Log

Start with the **Apache Error Log** (`logs/error_log`) - it's most likely to have the Strapi error message.

Look for entries around:
- **17:09-17:11** (when we saw 500 errors in access logs)
- **Recent times** when you tried to create articles

The error message will tell us exactly what's wrong!

