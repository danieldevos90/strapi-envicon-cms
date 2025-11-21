# Hosting Migration Notes - Strapi CMS

## Migration Date
After hosting migration, both `envicon.nl` (frontend) and `cms.envicon.nl` (Strapi CMS) are now on the same server.

## Important Configuration

### Server Configuration
- **Host**: Should be `0.0.0.0` (not `localhost`) to allow connections from other processes on the same server
- **Port**: Default `1337`
- **Environment**: Production

### .env Configuration

Ensure your `.env` file has:

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Database
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=your_database
DATABASE_USERNAME=your_user
DATABASE_PASSWORD=your_password

# URLs
STRAPI_ADMIN_CLIENT_URL=https://cms.envicon.nl
```

### Why `HOST=0.0.0.0`?

Setting `HOST=0.0.0.0` allows Strapi to accept connections from:
- Localhost (127.0.0.1) - for internal server-side requests from Next.js frontend
- External clients - via the domain `cms.envicon.nl`

If set to `localhost` or `127.0.0.1`, only localhost connections work.
If set to `0.0.0.0`, both localhost and external connections work.

### Frontend Connection

The frontend (`envicon.nl`) connects to CMS in two ways:

1. **Server-side (SSR)**: Uses `http://localhost:1337` for internal requests
2. **Browser-side**: Uses `https://cms.envicon.nl` for client-side requests

### CORS Configuration

Make sure CORS is configured to allow requests from `envicon.nl`:

In `config/middlewares.js`:

```javascript
{
  name: 'strapi::cors',
  config: {
    enabled: true,
    origin: ['https://envicon.nl', 'https://cms.envicon.nl'],
  },
},
```

### Verification

After migration, verify:

1. **CMS is accessible externally:**
   ```bash
   curl -I https://cms.envicon.nl/api/sectors
   ```

2. **CMS is accessible internally:**
   ```bash
   curl -I http://localhost:1337/api/sectors
   ```

3. **PM2 Status:**
   ```bash
   pm2 list | grep strapi
   ```

4. **Check logs:**
   ```bash
   pm2 logs strapi-cms --lines 50
   ```

### Troubleshooting

**Issue: Frontend can't connect to CMS**

- Check if CMS is running: `pm2 list`
- Check if port 1337 is listening: `netstat -tlnp | grep 1337`
- Verify HOST is set to `0.0.0.0` in `.env`
- Check CORS configuration allows `envicon.nl`

**Issue: External access works but internal doesn't**

- Verify `HOST=0.0.0.0` in `.env`
- Restart Strapi: `pm2 restart strapi-cms`
- Check firewall rules allow localhost connections

**Issue: Internal access works but external doesn't**

- Check DNS: `nslookup cms.envicon.nl`
- Verify SSL certificate is valid
- Check Apache/Nginx proxy configuration
- Verify port forwarding/routing is correct

## Related Documentation

- Frontend migration guide: `../HOSTING_MIGRATION_FIX.md`
- Apache proxy configuration: `../PLESK_APACHE_PROXY_FIX.md`
- Quick fix guide: `../QUICK_FIX_AFTER_MIGRATION.md`


