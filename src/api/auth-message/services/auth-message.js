'use strict';

/**
 * auth-message service.
 */

const {createCoreService} = require('@strapi/strapi').factories;

module.exports = createCoreService('api::auth-message.auth-message', ({strapi}) => ({
  async createAuthMessage() {
    let message
    let find

    // creating message, taking starting letter from .env in order to add an extra security layer for future database truncate
    do {
      message = process.env.JWT_AUTH_MESSAGE_STARTING_LETTER
      for (let i = 1; i <= 50; i++) {
        message += String(Math.floor(Math.random() * 9))
      }
      find = await strapi.entityService.findMany('api::auth-message.auth-message', {filters: {message: message}})
    } while (find.length)

    return message
  }
}));
