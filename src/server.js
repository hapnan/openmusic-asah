'use strict';

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const songs = require('./api/songs');
const albums = require('./api/albums');

const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const AlbumsService = require('./services/postgres/AlbumService');
const AlbumsValidator = require('./validator/albums');

const auth = require('./api/auth');
const AuthService = require('./services/postgres/AuthService');
const TokenManager = require('./tokenize/TokenManager');
const AuthValidator = require('./validator/auth');

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');

const collaborations = require('./api/collaboration');
const CollaborationService = require('./services/postgres/CollaborationService');
const CollaborationValidator = require('./validator/collaboration');

const exportsPlugin = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportValidator = require('./validator/export');

const uploads = require('./api/uploads');
const StrorageService = require('./services/storage/StrorageService');
const UploadsValidator = require('./validator/uploads');

const likes = require('./api/likes');
const LikeService = require('./services/postgres/LikeService');
const LikeValidator = require('./validator/likes');

const CacheService = require('./services/redis/CacheService');

const ClientError = require('./exeptions/ClientError');

const init = async () => {
  const cacheService = new CacheService();
  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const authService = new AuthService();
  const usersService = new UsersService();
  const collaborationsService = new CollaborationService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const likeService = new LikeService(cacheService);
  const storageService = new StrorageService(path.resolve(__dirname, 'api/uploads/file/images'));

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*']
      }
    }
  });

  await server.register([
    { plugin: Jwt },
  ]);

  await server.register([Inert]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    },
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: auth,
      options: {
        authService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthValidator
      }
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistValidator
      }
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        playlistsService,
        validator: CollaborationValidator
      }
    },
    {
      plugin: exportsPlugin,
      options: {
        playlistsService,
        producerService: ProducerService,
        validator: ExportValidator
      }
    },
    {
      plugin: uploads,
      options: {
        storageService,
        albumsService,
        validator: UploadsValidator
      }
    },
    {
      plugin: likes,
      options: {
        likeService,
        albumsService,
        validator: LikeValidator
      }
    }
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      });
      newResponse.code(500);
      return newResponse;
    }

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
