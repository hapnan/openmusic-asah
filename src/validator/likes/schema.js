const joi = require('joi');

const PostLikePayloadSchema = joi.object({
    albumId: joi.string().required(),
});

const DeleteLikePayloadSchema = joi.object({
    albumId: joi.string().required(),
});

module.exports = {
    PostLikePayloadSchema,
    DeleteLikePayloadSchema,
};
