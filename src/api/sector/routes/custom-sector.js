/**
 * Custom Strapi API Endpoint for Populating Sectors
 * This endpoint uses Strapi's Entity Service API which properly handles nested components
 * 
 * Usage: POST /api/sectors/populate-all
 * Body: {} (uses hardcoded data from text.md)
 */

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/sectors/populate-all',
      handler: 'sector.populateAll',
      config: {
        auth: false, // Set to true if you want to require authentication
      },
    },
  ],
};
