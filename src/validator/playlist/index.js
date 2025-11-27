const {
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exeptions/InvariantError');

const validatePlaylistPayload = (payload) => {
  const validationResult = PostPlaylistPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

const validatePlaylistSongPayload = (payload) => {
  const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);
  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }
};

module.exports = {
  validatePlaylistPayload,
  validatePlaylistSongPayload,
};
