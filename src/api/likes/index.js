const LikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { likeService, albumsService, validator }) => {
    const likeHandler = new LikeHandler(likeService, albumsService, validator);
    server.route(routes(likeHandler));
  },
};
