# Why WordPress Works But Strapi Doesn't

## The Difference

**WordPress URLs:**
```
/wp-admin/upload.php?page=1&paged=2
```
✅ Uses simple query parameters (`page=1`, `paged=2`)
✅ ModSecurity doesn't flag these as suspicious

**Strapi URLs:**
```
/upload/files?filters[$and][0][folderPath][$eq]=/
```
❌ Uses MongoDB operators (`$and`, `$eq`) in query strings
❌ ModSecurity sees `$and` and `$eq` as SQL injection attempts

---

## Why ModSecurity Blocks Strapi

ModSecurity rule 211760 specifically looks for MongoDB/SQL injection patterns:
- `$and`, `$eq`, `$ne`, `$in`, `$or`, etc.
- These are **legitimate** MongoDB operators that Strapi uses
- But ModSecurity treats them as attack attempts

WordPress doesn't use these operators, so it passes through fine.

---

## Solution: Configure Strapi to Avoid These Operators

Unfortunately, Strapi's upload plugin **requires** these operators for filtering. However, we can work around this:

### Option 1: Use Strapi API Without Filters (Simplest)

Instead of using the upload plugin's file browser, you can:
1. Upload files directly via the **Media Library** (`/admin/plugins/upload`)
2. Use the **"Add new assets"** button instead of browsing folders
3. This avoids the problematic query parameters

**Workaround:**
- Don't use folder filtering in the upload plugin
- Upload files directly without filtering

---

### Option 2: Contact Hosting Provider (Best Long-term)

Since WordPress works fine, ask your provider:

> "WordPress works fine on this server, but Strapi CMS is being blocked by ModSecurity rule 211760. Strapi uses MongoDB query operators (`$and`, `$eq`) which are legitimate but being flagged. Can you whitelist these operators for the domain cms.envicon.nl?"

**Why this works:**
- WordPress doesn't need special rules (already works)
- Strapi just needs an exception for MongoDB operators
- They can add a domain-specific exception

---

### Option 3: Use Different Upload Method

**Instead of:**
```
/admin/plugins/upload (with folder filtering)
```

**Use:**
```
/admin/plugins/upload → "Add new assets" (direct upload)
```

This bypasses the file browser that uses problematic query parameters.

---

## Why WordPress Doesn't Have This Issue

1. **WordPress uses MySQL** - Traditional SQL queries
2. **Simple query parameters** - `?page=1&s=search`
3. **No MongoDB operators** - Doesn't use `$and`, `$eq`, etc.
4. **ModSecurity friendly** - Standard web patterns

**Strapi uses:**
1. **MongoDB-style filtering** - Even with MySQL backend
2. **Query operators** - `$and`, `$eq`, `$in`, etc.
3. **Modern API patterns** - RESTful with advanced filtering
4. **Triggers security rules** - Looks like injection attempts

---

## Quick Test

Try accessing Strapi upload **without filtering**:

**This works:**
```
https://cms.envicon.nl/admin/plugins/upload
```

**This gets blocked:**
```
https://cms.envicon.nl/upload/files?filters[$and][0][folderPath][$eq]=/
```

The upload plugin page itself works - it's only the **file browser API** that's blocked.

---

## Best Solution

**Contact your hosting provider** and explain:

> "Strapi CMS uses MongoDB-style query operators for filtering (like `$and`, `$eq`). These are legitimate API parameters but ModSecurity rule 211760 is blocking them. WordPress works fine because it doesn't use these operators. Can you whitelist MongoDB operators for cms.envicon.nl?"

They can add a simple exception that:
- ✅ Keeps ModSecurity protection active
- ✅ Allows Strapi to work
- ✅ Doesn't affect WordPress (which doesn't use these operators anyway)

---

## Summary

| Feature | WordPress | Strapi |
|---------|-----------|-------|
| Query format | `?page=1` | `?filters[$and][0][$eq]=value` |
| ModSecurity | ✅ Passes | ❌ Blocked |
| Operators | None | MongoDB (`$and`, `$eq`) |
| Solution | None needed | Exception required |

**Bottom line:** WordPress works because it uses simple queries. Strapi needs an exception for MongoDB operators.

