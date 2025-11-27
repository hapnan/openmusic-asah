'use strict';

const joi = require('joi');

const PostPlaylistPayloadSchema = joi.object({
  name: joi.string().required()
});

const PostSongToPlaylistPayloadSchema = joi.object({
  songId: joi.string().required()
});

module.exports = {
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema
};
