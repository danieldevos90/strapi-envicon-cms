/**
 * Custom Strapi API Endpoint for seeding/repairing Sector content.
 *
 * Endpoint: POST /api/sectors/populate-all
 *
 * Security model:
 *   - `auth: true` — caller must present a valid Strapi API token / JWT.
 *   - The controller additionally enforces an env-based kill switch
 *     (`STRAPI_ALLOW_SECTOR_POPULATE`) so the route is inert in production
 *     unless the operator opts in explicitly.
 *
 * This route exists for one-off content migrations only. It should NOT be
 * relied on as part of the runtime API surface.
 */
module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/sectors/populate-all',
      handler: 'custom-sector.populateAll',
      config: {
        auth: true,
      },
    },
  ],
};
