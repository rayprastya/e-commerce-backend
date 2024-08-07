// serverTest.js
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const path = require('path');
const productRoutes = require('../src/routes/productRoutes');
const transactionRoutes = require('../src/routes/transactionRoutes');

const init = async () => {
    const server = Hapi.server({
        port: 3001,
        host: '127.0.0.1',
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with'],
            },
            files: {
                relativeTo: path.join(__dirname, '../uploads')
            }
        }
    });

    await server.register(Inert);
    server.route([...productRoutes, ...transactionRoutes]);

    server.ext('onPreResponse', (request, h) => {
        const response = request.response;

        if (response.isBoom) {
            console.error('Error:', response);
            return h.response({ message: 'Internal Server Error' }).code(response.output.statusCode);
        }

        return h.continue;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
    return server;
}

module.exports = init;
