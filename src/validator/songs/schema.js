'use strict';

const joi = require('joi');

const SongsPayloadSchema = joi.object({
    title: joi.string().required(),
    year: joi
        .number()
        .integer()
        .min(1900)
        .max(new Date().getFullYear())
        .required(),
    performer: joi.string().required(),
    genre: joi.string().required(),
    duration: joi.number().integer().min(1).required(),
    albumId: joi.string().optional()
});

module.exports = {
    SongsPayloadSchema
};
