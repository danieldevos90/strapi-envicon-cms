'use strict';

/**
 * sector router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::sector.sector');

module.exports = {
  routes: [
    ...defaultRouter.routes,
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

