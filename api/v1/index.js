const express = require('express');
const user = require('./User');
const post = require('./Post');
const listing = require('./Listing');
const tag = require('./Tag');
const authenticationMiddleware = require('../../middlewares/authenticationMiddleware');

module.exports = v1Routes => {
  const app = express.Router();
  v1Routes.use('/v1', app);
  app.use('/user', user);
  app.use('/post', authenticationMiddleware, post);
  app.use('/tag', authenticationMiddleware, tag);
  app.use('/listing', listing);
};
