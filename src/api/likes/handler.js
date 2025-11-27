class LikeHandler {
  constructor(likeService, albumService, validator) {
    this._likeService = likeService;
    this._albumService = albumService;
    this._validator = validator;

    this.postLikeHandler = this.postLikeHandler.bind(this);
    this.deleteLikeHandler = this.deleteLikeHandler.bind(this);
    this.getLikesCountHandler = this.getLikesCountHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    await this._validator.validatePostLikePayload(request.params);
    const { albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.verifyAlbumExists(albumId);
    await this._likeService.isAlbumLikedByUser(credentialId, albumId);
    await this._likeService.addLike(credentialId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Like added successfully'
      })
      .code(201);
  }

  async deleteLikeHandler(request, h) {
    await this._validator.validateDeleteLikePayload(request.params);
    const { id: credentialId } = request.auth.credentials;
    const { albumId } = request.params;

    await this._albumService.verifyAlbumExists(albumId);

    await this._likeService.removeLike(credentialId, albumId);

    return h
      .response({
        status: 'success',
        message: 'Like removed successfully'
      })
      .code(200);
  }

  async getLikesCountHandler(request, h) {
    const { albumId } = request.params;

    await this._albumService.verifyAlbumExists(albumId);

    const { count, source } = await this._likeService.getLikesCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: count
      }
    });

    response.code(200);

    if (source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = LikeHandler;
