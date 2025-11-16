# Quick Curl Debug Commands

## Debug Article: pije4nqe569muxg23nhulp6y

### Basic Test (Public Access)

```bash
curl "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*"
```

**Expected Results:**
- `404` = Article not found or not published
- `200` = Article found
- `500` = Server error

### With Authentication (if you have API token)

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*"
```

### Pretty Print JSON Response

```bash
curl -s "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y?populate=*" | python3 -m json.tool
```

### Check if Article Exists in List

```bash
# List all articles
curl -s "https://cms.envicon.nl/api/articles?pagination[limit]=100" | python3 -m json.tool

# Search for specific article ID
curl -s "https://cms.envicon.nl/api/articles?pagination[limit]=100" | grep "pije4nqe569muxg23nhulp6y"
```

### Test Publish Action (requires auth)

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y/actions/publish"
```

### Full Debug Script

Use the provided script:
```bash
./debug-article-curl.sh pije4nqe569muxg23nhulp6y YOUR_TOKEN
```

## Common Issues

### 404 Not Found
- Article doesn't exist
- Article is a draft (not published) - use auth token
- Article was deleted

### 500 Server Error
- Check Strapi server logs
- Article data might be corrupted
- Database connection issue

### 401 Unauthorized
- Need API token for draft articles
- Token expired or invalid

## Quick Commands Reference

```bash
# Test article exists (public)
curl "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y"

# Test with auth (drafts)
curl -H "Authorization: Bearer TOKEN" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y"

# Test publish
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  "https://cms.envicon.nl/api/articles/pije4nqe569muxg23nhulp6y/actions/publish"

# List all articles
curl "https://cms.envicon.nl/api/articles?pagination[limit]=10"
```

