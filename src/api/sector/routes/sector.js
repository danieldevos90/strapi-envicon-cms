'use strict';

/**
 * sector router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::sector.sector');

const customRoutes = {
  routes: [
    {
      method: 'POST',
      path: '/sectors/populate-all',
      handler: 'custom-sector.populateAll',
      config: {
        auth: false,
      },
    },
  ],
};

module.exports = {
  routes: [
    ...defaultRouter.routes,
    ...customRoutes.routes,
  ],
};

