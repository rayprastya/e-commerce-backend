const fs = require('fs');
const path = require('path');
const productService = require('../services/productService');
const productSchema = require('../schemas/productSchema');
const axios = require('axios');

// Generate random SKU
const generateRandomSKU = () => {
    const milliseconds = Date.now();
    const randomNumber = Math.floor(Math.random() * 1000);
    return `SKU_${milliseconds}_${randomNumber}`;
};

// Get dummy product endpoint
const getDummyProduct = async (request, h) => {
    const limit = parseInt(request.query.limit, 10) || 100; 

    try {
        const response = await axios.get(`https://dummyjson.com/products?limit=${limit}&skip=10&select=title,price,description,stock`);
        const products = response.data.products;

        const additionalData = products.map((product, index) => ({
            ...product,
            sku: generateRandomSKU(),
            image: "https://placebear.com/g/200/200",
        }));

        // Save products
        const savedProducts = await productService.createProduct(additionalData);
        return h.response(savedProducts).code(201);

    } catch (err) {
        console.error("Error:", err);
        return h.response({ message: err.message }).code(400);
    }
};

// Get all products endpoint
const getAllProducts = async (request, h) => {
    const offset = parseInt(request.query.offset, 10) || 0;
    const limit = parseInt(request.query.limit, 10) || 10;

    try {
        const products = await productService.getAllProducts(offset, limit);
        return h.response(products).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};


// Get product by SKU endpoint
const getProductBySKU = async (request, h) => {
    try {
        const product = await productService.getProductBySKU(request.params.sku);
        if (!product) {
            return h.response({ message: 'Product not found' }).code(404);
        }
        return h.response(product).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Image upload function
const imageUpload = async (image) => {
    const fileName = `${Date.now()}-${image.hapi.filename}`;
    let imagePath = path.join(__dirname, '../../uploads', fileName);

    const fileStream = fs.createWriteStream(imagePath);
    image.pipe(fileStream);

    await new Promise((resolve, reject) => {
        image.on('end', resolve);
        image.on('error', reject);
    });

    return `http://localhost:3000/uploads/${fileName}`;
}

// create product endpoint
const createProduct = async (request, h) => {
    const { title, sku, price, description, stock, image } = request.payload;

    const productData = {
        title,
        sku,
        price: parseFloat(price),
        description,
        stock: parseInt(stock, 10)
    };

    console.log('Files:', request.payload);

    const { error, value } = productSchema.validate(productData);
    if (error) return h.response({ message: error.details[0].message }).code(400);

    // change to list to handle many data insertion from dummyjson
    const products = Array.isArray(value) ? value : [value];

    if (image) {
        value.image = await imageUpload(image);
    }

    try {
        const savedProducts = await productService.createProduct(products);
        return h.response(savedProducts).code(201);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Update product endpoint
const updateProduct = async (request, h) => {
    const { sku } = request.params;

    const { title, price, description, stock, image } = request.payload;

    const productData = {
        title,
        sku,
        price: parseFloat(price),
        description,
        stock: parseInt(stock, 10)
    };
    
    const { error, value } = productSchema.validate(productData);
    
    if (error) return h.response({ message: error.details[0].message }).code(400);

    if (image) {
        value.image = await imageUpload(image);
    }

    try {
        const product = await productService.updateProduct(sku, value);
        return h.response(product).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Delete product endpoint
const deleteProduct = async (request, h) => {
    const { sku } = request.params;

    try {
        await productService.deleteProduct(sku);
        return h.response({ message: 'Product and associated transactions deleted' }).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

module.exports = {
    getDummyProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductBySKU
};
