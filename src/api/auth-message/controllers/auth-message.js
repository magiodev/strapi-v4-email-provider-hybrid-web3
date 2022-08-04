'use strict';

/**
 *  auth-message controller
 */
const utils = require('@strapi/utils');
const {ApplicationError, ValidationError} = utils.errors;

const {createCoreController} = require('@strapi/strapi').factories;

module.exports = createCoreController('api::auth-message.auth-message', ({strapi}) => ({
  async find() {
    let authMessage = await strapi.service('api::auth-message.auth-message').createAuthMessage(process.env.JWT_AUTH_MESSAGE_EXPIRY_DURATION)
    let payload = {message: authMessage}
    let response
    try {
      response = await strapi.entityService.create('api::auth-message.auth-message', {data: payload});
    } catch (e) {
      throw new ApplicationError('Something went wrong.')
    }

    return response
  }
}));
