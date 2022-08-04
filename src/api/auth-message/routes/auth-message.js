'use strict';

/**
 * auth-message router.
 */

const {createCoreRouter} = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::auth-message.auth-message', {
  only: ['find']
});
