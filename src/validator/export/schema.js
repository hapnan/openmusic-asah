'use strict';

const Joi = require('joi');

const ExportPlaylistPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: false }).required(),
});

module.exports = { ExportPlaylistPayloadSchema };
