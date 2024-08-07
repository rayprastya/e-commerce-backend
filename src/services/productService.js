const productRepository = require('../repositories/productRepository');

const getAllProducts = async (offset, limit) => {
    return await productRepository.getAllProducts(offset, limit);
};

const getProductBySKU = async (sku) => {
    return await productRepository.getProductBySKU(sku);
};

const createProduct = async (product) => {
    return await productRepository.createProduct(product);
};

const updateProduct = async (sku, product) => {
    return await productRepository.updateProduct(sku, product);
};

const deleteProduct = async (sku) => {
    return await productRepository.deleteProduct(sku);
};

module.exports = {
    getAllProducts,
    getProductBySKU,
    createProduct,
    updateProduct,
    deleteProduct,
};
