'use strict';

const joi = require('joi');

const PostAuthPayloadSchema = joi.object({
  username: joi.string().required(),
  password: joi.string().required()
});

const PutAuthPayloadSchema = joi.object({
  refreshToken: joi.string().required()
});

const DeleteAuthPayloadSchema = joi.object({
  refreshToken: joi.string().required()
});

module.exports = {
  PostAuthPayloadSchema,
  PutAuthPayloadSchema,
  DeleteAuthPayloadSchema
};
