'use strict';
const { UsersPayloadSchema } = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UsersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error);
    }
  },
};

module.exports = UsersValidator;
