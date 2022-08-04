'use strict';
module.exports = (plugin) => {
  plugin.contentTypes = require('./server/content-types');
  plugin.controllers = require('./server/controllers');
  return plugin;
};
