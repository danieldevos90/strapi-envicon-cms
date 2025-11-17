/**
 * Query Sanitizer Middleware
 * 
 * Converts MongoDB-style queries to WordPress-style simple queries
 * This prevents ModSecurity from blocking Strapi API requests
 */

export default (config: { enabled?: boolean }, { strapi }: { strapi: any }) => {
  return async (ctx: any, next: () => Promise<any>) => {
    // Only process if enabled
    if (config.enabled === false) {
      return next();
    }

    // Sanitize query parameters to prevent ModSecurity issues
    if (ctx.request.query) {
      const query = ctx.request.query;
      
      // Remove or simplify complex query operators that ModSecurity might block
      // Convert filters[field][$eq] to filters[field]
      if (query.filters) {
        const filters = query.filters;
        const sanitizedFilters: any = {};
        
        for (const [key, value] of Object.entries(filters)) {
          // Handle nested filters
          if (typeof value === 'object' && value !== null) {
            // Remove $ operators that might trigger ModSecurity
            const sanitizedValue: any = {};
            for (const [subKey, subValue] of Object.entries(value as any)) {
              // Keep simple operators, remove complex ones
              if (!subKey.startsWith('$')) {
                sanitizedValue[subKey] = subValue;
              } else if (subKey === '$eq') {
                // Convert $eq to direct value
                sanitizedFilters[key] = subValue;
                continue;
              }
            }
            if (Object.keys(sanitizedValue).length > 0) {
              sanitizedFilters[key] = sanitizedValue;
            }
          } else {
            sanitizedFilters[key] = value;
          }
        }
        
        query.filters = sanitizedFilters;
      }
      
      // Simplify populate parameters
      if (query.populate) {
        // Keep populate as is, but ensure it's a string or simple object
        if (typeof query.populate === 'object' && query.populate !== null) {
          // Convert complex populate objects to simple strings
          const populateKeys = Object.keys(query.populate);
          if (populateKeys.length === 1 && populateKeys[0] === '*') {
            query.populate = '*';
          }
        }
      }
    }

    await next();
  };
};

