'use strict';

const { UploadsPayloadSchema } = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const UploadsValidator = {
  validateUploadPayload: (payload) => {
    const validationResult = UploadsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = UploadsValidator;
