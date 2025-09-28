'use strict';

const { AlbumPayloadSchema } = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const AlbumValidator = {
    validateAlbumPayload: (payload) => {
        const validation = AlbumPayloadSchema.validate(payload);
        if (validation.error) {
            throw new InvariantError(validation.error);
        }
    }
};

module.exports = AlbumValidator;
