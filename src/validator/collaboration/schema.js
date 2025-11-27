'use strict';

const joi = require('joi');

const PostCollaborationPayloadSchema = joi.object({
  playlistId: joi.string().required(),
  userId: joi.string().required()
});

const DeleteCollaborationPayloadSchema = joi.object({
  playlistId: joi.string().required(),
  userId: joi.string().required()
});

module.exports = {
  PostCollaborationPayloadSchema,
  DeleteCollaborationPayloadSchema
};
