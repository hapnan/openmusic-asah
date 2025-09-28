const joi = require("joi");

const AlbumPayloadSchema = joi.object({
  name: joi.string().required(),
  year: joi
    .number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required(),
});

module.exports = {
  AlbumPayloadSchema,
};
