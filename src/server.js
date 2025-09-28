'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/songs');
const albums = require('./api/albums');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');
const AlbumsService = require('./services/postgres/AlbumService');
const AlbumsValidator = require('./validator/albums');
const ClientError = require('./exeptions/ClientError');

const init = async () => {
    const songsService = new SongsService();
    const albumsService = new AlbumsService();
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost',
        routes: {
            cors: {
                origin: ['*']
            }
        }
    });

    await server.register({
        plugin: songs,
        options: {
            service: songsService,
            validator: SongsValidator
        }
    });

    await server.register({
        plugin: albums,
        options: {
            service: albumsService,
            validator: AlbumsValidator
        }
    });

    server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
        const { response } = request;

        if (response instanceof Error) {
            // penanganan client error secara internal.
            if (response instanceof ClientError) {
                const newResponse = h.response({
                    status: 'fail',
                    message: response.message
                });
                newResponse.code(response.statusCode);
                return newResponse;
            }

            // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
            if (!response.isServer) {
                return h.continue;
            }

            // penanganan server error sesuai kebutuhan
            const newResponse = h.response({
                status: 'error',
                message: 'terjadi kegagalan pada server kami'
            });
            newResponse.code(500);
            return newResponse;
        }

        // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
