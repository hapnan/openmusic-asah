class PlaylistHandler {
    constructor(playlistService, validator) {
        // Remove extra parameters you're not using
        this._playlistService = playlistService;
        this._validator = validator;

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
        this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
        this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
        this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
    }

    async postPlaylistHandler(request, h) {
        this._validator.validatePlaylistPayload(request.payload);

        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await this._playlistService.addPlaylist({
            name,
            owner: credentialId,
        });

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId,
            },
        });
        response.code(201);
        return response;
    }

    async getPlaylistsHandler(request) {
        const { id: userId } = request.auth.credentials;

        const playlists = await this._playlistService.getPlaylists(userId);

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }

    async getPlaylistSongsHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistService.verifyPlaylistAccess(id, credentialId);

        const playlist = await this._playlistService.getPlaylistWithSongs(id);

        return {
            status: 'success',
            data: {
                playlist,
            },
        };
    }

    async getPlaylistActivitiesHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistService.verifyPlaylistAccess(id, credentialId);
        const activities = await this._playlistService.getActivities(id);

        return {
            status: 'success',
            data: activities,
        };
    }

    async deletePlaylistHandler(request) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;

        // Only owners can delete playlists
        await this._playlistService.verifyPlaylistOwner(id, credentialId);

        await this._playlistService.deletePlaylistById(id);
        return {
            status: 'success',
            message: 'Playlist deleted successfully',
        };
    }
    async addSongToPlaylistHandler(request, h) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistService.addSongToPlaylist(playlistId, songId, credentialId); // Pass user ID

        const response = h.response({
            status: 'success',
            message: 'Song added to playlist successfully',
        });
        response.code(201);
        return response;
    }
    async deleteSongFromPlaylistHandler(request) {
        this._validator.validatePlaylistSongPayload(request.payload);
        const { id: playlistId } = request.params;
        const { songId } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
        await this._playlistService.deleteSongFromPlaylist(playlistId, songId, credentialId); // Pass user ID

        return {
            status: 'success',
            message: 'Song removed from playlist successfully',
        };
    }
}

module.exports = PlaylistHandler;
