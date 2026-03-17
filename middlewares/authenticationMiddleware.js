const {getUserDetails} = require('../api/v1/User/User.model');
const {getPayload} = require('../services/jwt.service');
const {responseMessages} = require('../config/config');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    req.error = {
      status: 401,
      message: responseMessages[401],
    };
    return next(new Error());
  }

  try {
    const token = req.headers.authorization.split(/\s/)[1];

    if (!token) {
      req.error = {
        status: 401,
        message: responseMessages[401],
      };
      return next(new Error());
    }

    const {email} = getPayload(token);
    const user = await getUserDetails(email);
    if (!user) {
      req.error = {
        status: 401,
        message: responseMessages[401],
      };
      return next(new Error());
    }
    req.user = user;
    return next();
  } catch (e) {
    if (e.name === 'JsonWebTokenError') {
      req.error = {
        status: 401,
        message: responseMessages[401],
      };
      return next(new Error());
    }
    return next(e);
  }
};
