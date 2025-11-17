# Curl Commands for Debugging Articles

## Article ID: pije4nqe569muxg23nhulp6y

### Current Status: 404 Not Found

This means:
- ❌ Article doesn't exist, OR
- ⚠️ Article is a draft (not published) - requires authentication, OR
- ❌ Article was deleted

## Quick Curl Commands

### 1. Test Article (Public - Published Articles Only)

```bash
curl "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*"
```

**Result:** Returns 404 if article doesn't exist or is not published

### 2. Test Article (With Authentication - Includes Drafts)

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*"
```

**Get API Token:**
- Strapi Admin → Settings → API Tokens → Create new token
- Give it "Full access" or "Article" read permissions

### 3. Pretty Print Response

```bash
curl -s "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*" | python3 -m json.tool
```

### 4. Check if Article Exists in List

```bash
# List all published articles
curl -s "https://cms.envicon.nl/api/articles?pagination[limit]=100" | python3 -m json.tool | grep -i "pije4nqe569muxg23nhulp6y"

# List all articles (including drafts) - requires auth
curl -s -H "Authorization: Bearer YOUR_TOKEN" \
  "https://cms.envicon.nl/api/articles?pagination[limit]=100" | python3 -m json.tool | grep -i "pije4nqe569muxg23nhulp6y"
```

### 5. Test Publish Action (If Article Exists as Draft)

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y/actions/publish"
```

### 6. Get Article with Verbose Output

```bash
curl -v "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*" 2>&1 | grep -E "(HTTP|404|200|500)"
```

## Debug Scripts

### Use the Debug Script

```bash
# Basic debug (no auth)
./debug-article-curl.sh pije4nqe569muxg23nhulp6y

# Debug with authentication
./debug-article-curl.sh pije4nqe569muxg23nhulp6y YOUR_API_TOKEN

# Quick debug for this specific article
./debug-article-pije4nqe569muxg23nhulp6y.sh
```

## Common Responses

### 404 Not Found
```json
{
  "data": null,
  "error": {
    "status": 404,
    "name": "NotFoundError",
    "message": "Not Found"
  }
}
```
**Meaning:** Article doesn't exist or is not published (draft)

**Solution:** 
- Check if article exists in Strapi admin
- If it's a draft, use authentication token
- Article might have been deleted

### 200 OK
```json
{
  "data": {
    "id": "pije4nqe569muxg23nhulp6y",
    "attributes": {
      "title": "...",
      "slug": "...",
      ...
    }
  }
}
```
**Meaning:** Article found and accessible

### 500 Server Error
```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error"
  }
}
```
**Meaning:** Server-side error

**Solution:** Check Strapi server logs

### 401 Unauthorized
```json
{
  "error": {
    "status": 401,
    "message": "Unauthorized"
  }
}
```
**Meaning:** Invalid or missing API token

**Solution:** Get a valid API token from Strapi admin

## Quick Reference

```bash
# Test article (public)
curl "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y"

# Test article (with auth)
curl -H "Authorization: Bearer TOKEN" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y"

# Test publish
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y/actions/publish"

# List articles
curl "https://cms.envicon.nl/api/articles?pagination[limit]=10"

# Pretty print
curl -s "URL" | python3 -m json.tool
```

## Next Steps

1. **If 404:** Check Strapi admin to see if article exists
2. **If draft:** Use API token to access it
3. **If doesn't exist:** Article was deleted or ID is wrong
4. **If 500:** Check Strapi server logs for detailed error

