# Running Debug Scripts via npm on Plesk

Since you can only use npm on Plesk, here's how to run the debug scripts.

## Available npm Scripts

### 1. Debug Publish Action (500 Error)

**Command:**
```bash
npm run debug:publish
```

**What it does:**
- Tests Strapi connectivity
- Checks article schema requirements
- Creates a test article
- Attempts to publish it
- Shows detailed error messages if publish fails
- Cleans up test article

**Requirements:**
- `STRAPI_API_TOKEN` must be set in `.env` file
- Strapi must be running

**Example output:**
```
🔍 Debugging Article Publish Action 500 Error
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Strapi URL: https://cms.envicon.nl

1️⃣ Checking article schema requirements...
✅ Article API is accessible

2️⃣ Testing article creation (draft)...
✅ Test article created successfully
   Article ID: abc123...

3️⃣ Testing publish action...
❌ Publish action failed (this is the issue!):
   Status: 500
   Error Data: {...}
```

### 2. Debug Specific Article

**Command:**
```bash
npm run debug:article-id
```

Or with a specific article ID:
```bash
npm run debug:article-id djsce4ne3dg12af0yvytiplt
```

**What it does:**
- Checks if article exists
- Verifies all required fields are present
- Checks for duplicate slugs
- Identifies data issues
- Shows article details

**Requirements:**
- `STRAPI_API_TOKEN` must be set in `.env` file (optional but recommended)
- Article ID (defaults to `djsce4ne3dg12af0yvytiplt` if not provided)

**Example:**
```bash
# Debug the default problematic article
npm run debug:article-id

# Debug a specific article
npm run debug:article-id YOUR_ARTICLE_ID_HERE
```

### 3. Debug General Article API

**Command:**
```bash
npm run debug:article
```

**What it does:**
- Tests general article API connectivity
- Checks for 500 errors on article endpoints
- Tests with and without authentication

## Setting Up Environment Variables

Before running the scripts, make sure your `.env` file has:

```bash
STRAPI_URL=https://cms.envicon.nl
# or
CMS_URL=https://cms.envicon.nl

STRAPI_API_TOKEN=your_api_token_here
```

**To get an API token:**
1. Go to Strapi Admin → Settings → API Tokens
2. Click "Create new API Token"
3. Name it "Debug Token" or similar
4. Select "Full access" or at least "Article" read/write permissions
5. Copy the token and add it to `.env`

## Running on Plesk

### Method 1: Via Plesk Node.js Interface

1. Log into Plesk
2. Go to **Domains** → **your-domain.com** → **Node.js**
3. Open **Terminal** or **SSH Terminal**
4. Navigate to your Strapi directory:
   ```bash
   cd /path/to/strapi-cms
   ```
5. Run the debug script:
   ```bash
   npm run debug:publish
   ```

### Method 2: Via SSH (if available)

```bash
ssh your-server
cd /path/to/strapi-cms
npm run debug:publish
```

### Method 3: Via Plesk File Manager + Scheduled Tasks

1. Create a script file: `run-debug.sh`
2. Add:
   ```bash
   #!/bin/bash
   cd /path/to/strapi-cms
   npm run debug:publish > debug-output.log 2>&1
   ```
3. Make it executable
4. Run via Plesk Scheduled Tasks

## Understanding the Output

### Success Indicators:
- ✅ Green checkmarks = Test passed
- "success" status = No issues found

### Warning Indicators:
- ⚠️ Yellow warnings = Potential issues
- "warning" status = Issues found but not critical

### Error Indicators:
- ❌ Red X = Test failed
- "failed" status = Critical issue found

## Common Issues and Fixes

### Issue: "STRAPI_API_TOKEN not found"

**Fix:**
1. Edit `.env` file in Plesk File Manager
2. Add: `STRAPI_API_TOKEN=your_token_here`
3. Save and try again

### Issue: "Cannot connect to Strapi"

**Fix:**
1. Check if Strapi is running in Plesk Node.js
2. Verify `STRAPI_URL` in `.env` is correct
3. Check firewall/network settings

### Issue: "Publish action failed"

**Common causes:**
1. Missing required fields (title, slug, excerpt, content)
2. Duplicate slug
3. Invalid RichText content
4. Database constraint violation

**Fix:** Follow the recommendations shown in the debug output

## Quick Reference

```bash
# Debug publish action (most common issue)
npm run debug:publish

# Debug specific article
npm run debug:article-id

# Debug specific article with custom ID
npm run debug:article-id YOUR_ARTICLE_ID

# Debug general article API
npm run debug:article
```

## Next Steps After Debugging

1. **Review the output** - Look for ❌ errors and ⚠️ warnings
2. **Check recommendations** - The script will suggest fixes
3. **Fix identified issues** - Follow the recommendations
4. **Test again** - Run the debug script again to verify fixes
5. **Try publishing** - Attempt to publish the article in Strapi admin

## Need More Help?

- Check `STRAPI_PUBLISH_500_FIX.md` for detailed troubleshooting
- Review `STRAPI_PLESK_DEBUG_GUIDE.md` for Plesk-specific help
- Check Strapi server logs for detailed error messages

