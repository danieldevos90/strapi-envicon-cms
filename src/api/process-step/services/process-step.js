'use strict';

/**
 * process-step service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::process-step.process-step');

