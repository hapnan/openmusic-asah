'use strict';

const { SongsPayloadSchema } = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validation = SongsPayloadSchema.validate(payload);
        if (validation.error) {
            throw new InvariantError(validation.error);
        }
    }
};

module.exports = SongsValidator;
