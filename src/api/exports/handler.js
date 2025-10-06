'use strict';

class ExportsHandler {
    constructor(playlistsService, producerService, validator) {
        this._playlistsService = playlistsService;
        this._producerService = producerService;
        this._validator = validator;

        this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
    }

    async postExportPlaylistHandler(request, h) {
        this._validator.validateExportPlaylistPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId } = request.params;
        const { targetEmail } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

        const message = {
            playlistId,
            targetEmail,
        };

        await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Your request is being processed',
        });
        response.code(201);
        return response;
    }
}

module.exports = ExportsHandler;
