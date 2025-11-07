// Middleware to convert MongoDB-style queries to WordPress-style simple queries
// This prevents ModSecurity from blocking Strapi API requests

export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  // Custom middleware to sanitize query parameters
  {
    name: 'global::query-sanitizer',
    config: {
      enabled: true,
    },
  },
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '256mb',
      jsonLimit: '256mb',
      textLimit: '256mb',
      formidable: {
        maxFileSize: 250 * 1024 * 1024,
      },
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
