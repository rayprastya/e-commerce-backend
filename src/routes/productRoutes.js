const productController = require('../controllers/productController');

const options = {
    payload: {
        output: 'stream',
        parse: true,
        allow: ['application/json', 'multipart/form-data'],
        multipart: {
            output: 'stream'
        },
    }
}
module.exports = [
    { method: 'GET', path: '/products', handler: productController.getAllProducts },
    { method: 'GET', path: '/products-dummy', handler: productController.getDummyProduct },
    { method: 'GET', path: '/products/{sku}', handler: productController.getProductBySKU },
    { method: 'POST', path: '/products', options: options, handler: productController.createProduct },
    { method: 'PUT', path: '/products/{sku}', options: options, handler: productController.updateProduct },
    { method: 'DELETE', path: '/products/{sku}', handler: productController.deleteProduct },
];
