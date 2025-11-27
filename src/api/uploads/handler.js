'use strict';

const InvariantError = require('../../exeptions/InvariantError');

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { id: albumId } = request.params;
      const { cover } = request.payload;

      console.log('Payload keys:', Object.keys(request.payload)); // Debug line

      if (!cover) {
        throw new InvariantError('Berkas tidak ditemukan pada request');
      }

      this._validator.validateUploadPayload(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const host = process.env.HOST;
      const port = process.env.PORT;
      const fileLocation = `http://${host}:${port}/upload/images/${filename}`;

      await this._albumsService.updateAlbumCoverById(albumId, fileLocation);

      const response = h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah'
      });
      response.code(201);
      return response;
    }
    catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

module.exports = UploadsHandler;
