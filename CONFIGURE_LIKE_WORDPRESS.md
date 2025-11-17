# Configure Strapi to Work Like WordPress (Avoid ModSecurity Blocks)

## The Problem

Strapi uses MongoDB-style query operators (`$and`, `$eq`) that ModSecurity blocks, while WordPress uses simple queries that pass through fine.

## Solution: Use POST Requests Instead of GET

The simplest solution is to configure Strapi's upload plugin to use POST requests for filtering instead of GET requests with query parameters.

---

## Option 1: Modify Upload Plugin (Recommended)

Unfortunately, Strapi's upload plugin is built-in and hard to modify. The best approach is:

### Use Direct Upload (Bypasses Filtering)

Instead of using the file browser with filters:
1. Go to `/admin/plugins/upload`
2. Click **"Add new assets"** button
3. Upload files directly

This avoids the problematic query parameters entirely.

---

## Option 2: Create API Proxy Endpoint

Create a custom API endpoint that proxies upload requests using POST:

**File:** `src/api/upload-proxy/controllers/upload-proxy.ts`

```typescript
export default {
  async list(ctx) {
    // Accept filters in POST body instead of query string
    const { filters, pagination, sort, populate } = ctx.request.body;
    
    // Call Strapi's upload service with filters
    const uploadService = strapi.plugin('upload').service('upload');
    
    // Convert to Strapi's internal format
    const query = {
      filters: filters || {},
      pagination: pagination || { page: 1, pageSize: 10 },
      sort: sort || ['createdAt:DESC'],
      populate: populate || {},
    };
    
    const files = await uploadService.findMany(query);
    
    return files;
  },
};
```

Then modify the admin panel to use POST requests.

---

## Option 3: Contact Hosting Provider (Simplest)

Since WordPress works fine, ask your provider to:

> "Please whitelist MongoDB query operators (`$and`, `$eq`, `$in`, etc.) for the domain cms.envicon.nl. These are legitimate API parameters used by Strapi CMS, similar to how WordPress uses simple query parameters."

This is the **simplest solution** - no code changes needed.

---

## Option 4: Use Nginx Reverse Proxy

If you have access to nginx configuration, you can proxy requests and sanitize them:

```nginx
location /upload {
    # Proxy to Strapi
    proxy_pass http://localhost:1337;
    
    # Remove MongoDB operators from query string before forwarding
    # (requires custom nginx module or lua script)
}
```

---

## Why WordPress Works

WordPress URLs:
```
/wp-admin/upload.php?page=1
```
✅ Simple query parameters
✅ No operators
✅ ModSecurity passes

Strapi URLs:
```
/upload/files?filters[$and][0][folderPath][$eq]=/
```
❌ MongoDB operators in query string
❌ ModSecurity blocks

---

## Best Solution

**Contact your hosting provider** and ask them to whitelist MongoDB operators for Strapi. This is:
- ✅ Simplest (no code changes)
- ✅ Proper solution (not a workaround)
- ✅ Doesn't affect WordPress (which doesn't use these operators)
- ✅ They can do it in seconds

---

## Workaround: Use Direct Upload

Until ModSecurity is configured:

1. **Don't use folder filtering** in upload plugin
2. **Use "Add new assets"** button for direct uploads
3. **Organize files manually** instead of using folder browser

This bypasses the problematic query parameters entirely.

---

## Summary

| Solution | Complexity | Effectiveness |
|----------|------------|--------------|
| Contact provider | ⭐ Easy | ✅✅✅ Best |
| Direct upload only | ⭐ Easy | ✅✅ Good |
| API proxy | ⭐⭐⭐ Hard | ✅✅ Good |
| Nginx rewrite | ⭐⭐ Medium | ✅✅ Good |

**Recommendation:** Contact hosting provider first (simplest). Use direct upload as temporary workaround.

