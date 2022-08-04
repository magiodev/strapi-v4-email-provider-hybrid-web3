'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require('lodash');
const utils = require('@strapi/utils');
const {getService} = require('@strapi/plugin-users-permissions/server/utils');
const {validateCreateUserBody, validateUpdateUserBody} = require('./validation/user');

const {sanitize} = utils;
const {ApplicationError, ValidationError, NotFoundError} = utils.errors;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel('plugin::users-permissions.user');
  const {auth} = ctx.state;

  return sanitize.contentAPI.output(user, schema, {auth});
};

module.exports = {
  /**
   * Create a/an user record.
   * @return {Object}
   */
  async create(ctx) {
    const advanced = await strapi
      .store({type: 'plugin', name: 'users-permissions', key: 'advanced'})
      .get();

    await validateCreateUserBody(ctx.request.body);

    const {email} = ctx.request.body;

    if (advanced.unique_email) {
      const userWithSameEmail = await strapi
        .query('plugin::users-permissions.user')
        .findOne({where: {email: email.toLowerCase()}});

      if (userWithSameEmail) {
        throw new ApplicationError('Email already taken');
      }
    }

    const user = {
      ...ctx.request.body,
      provider: 'local',
    };

    user.email = _.toLower(user.email);

    if (!role) {
      const defaultRole = await strapi
        .query('plugin::users-permissions.role')
        .findOne({where: {type: advanced.default_role}});

      user.role = defaultRole.id;
    }

    try {
      const data = await getService('user').add(user);
      const sanitizedData = await sanitizeOutput(data, ctx);

      ctx.created(sanitizedData);
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },

  /**
   * Update a/an user record.
   * @return {Object}
   */
  async update(ctx) {
    const advancedConfigs = await strapi
      .store({type: 'plugin', name: 'users-permissions', key: 'advanced'})
      .get();

    const {id} = ctx.params;
    const {email} = ctx.request.body;

    const user = await getService('user').fetch(id);
    if (!user) {
      throw new NotFoundError(`User not found`);
    }

    await validateUpdateUserBody(ctx.request.body);

    if (_.has(ctx.request.body, 'email') && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query('plugin::users-permissions.user')
        .findOne({where: {email: email.toLowerCase()}});

      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ApplicationError('Email already taken');
      }
      ctx.request.body.email = ctx.request.body.email.toLowerCase();
    }

    let updateData = {
      ...ctx.request.body,
    };

    const userEdit = await getService('user').edit(user.id, updateData);
    const sanitizedData = await sanitizeOutput(userEdit, ctx);

    try {
      await getService('user').sendConfirmationEmail(userEdit);
    } catch (err) {
      throw new ApplicationError(err.message);
    }

    ctx.send(sanitizedData);
  },

  /**
   * Retrieve user records.
   * @return {Object|Array}
   */
  async find(ctx) {
    const users = await getService('user').fetchAll(ctx.query);

    ctx.body = await Promise.all(users.map(user => sanitizeOutput(user, ctx)));
  },

  /**
   * Retrieve a user record.
   * @return {Object}
   */
  async findOne(ctx) {
    const {id} = ctx.params;
    const {query} = ctx;

    let data = await getService('user').fetch(id, query);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }

    ctx.body = data;
  },

  /**
   * Retrieve user count.
   * @return {Number}
   */
  async count(ctx) {
    ctx.body = await getService('user').count(ctx.query);
  },

  /**
   * Destroy a/an user record.
   * @return {Object}
   */
  async destroy(ctx) {
    const {id} = ctx.params;

    const data = await getService('user').remove({id});
    const sanitizedUser = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedUser);
  },

  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized();
    }

    ctx.body = await sanitizeOutput(user, ctx);
  },
};
