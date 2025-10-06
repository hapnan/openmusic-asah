const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: handler.postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                maxBytes: 512000, // 500 KB
                multipart: true,
                output: 'stream',
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/images/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'file'),
            },
        },
    },
];

module.exports = routes;
