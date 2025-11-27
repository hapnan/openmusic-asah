'use strict';

const Joi = require('joi');

const UsersPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().max(50).required(),
  fullname: Joi.string().max(100).required(),
});

module.exports = { UsersPayloadSchema };
