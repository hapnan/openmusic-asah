'use strict';

const { PostLikePayloadSchema, DeleteLikePayloadSchema } = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const LikeValidator = {
  validatePostLikePayload: (payload) => {
    const validationResult = PostLikePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteLikePayload: (payload) => {
    const validationResult = DeleteLikePayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = LikeValidator;
