const CollaborationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, playlistsService, validator }) => {
    // Fix the parameter order to match constructor
    const handler = new CollaborationHandler(service, playlistsService, validator);
    server.route(routes(handler));
  },
};
