'use strict';

const { PostCollaborationPayloadSchema, DeleteCollaborationPayloadSchema } = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const CollaborationValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = PostCollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = DeleteCollaborationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = CollaborationValidator;
