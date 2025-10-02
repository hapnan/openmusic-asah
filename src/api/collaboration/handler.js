class CollaborationHandler {
    constructor(collaborationService, playlistsService, validator) {
        this._collaborationService = collaborationService;
        this._playlistsService = playlistsService;
        this._validator = validator;

        this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
        this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
    }

    async postCollaborationHandler(request, h) {
        this._validator.validatePostCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        const collaborationid = await this._collaborationService.addCollaboration(
            playlistId,
            userId
        );

        const response = h.response({
            status: 'success',
            message: 'Kolaborasi berhasil ditambahkan',
            data: {
                collaborationId: collaborationid,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCollaborationHandler(request, h) {
        this._validator.validateDeleteCollaborationPayload(request.payload);
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, userId } = request.payload;

        await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
        await this._collaborationService.deleteCollaboration(playlistId, userId);

        return h
            .response({
                status: 'success',
                message: 'Kolaborasi berhasil dihapus',
            })
            .code(200);
    }
}

module.exports = CollaborationHandler;
