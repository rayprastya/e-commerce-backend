const db = require('../config/db');

// Check if SKU exists
const getProductBySKU = async (sku) => {
    const result = await db.query('SELECT * FROM products WHERE sku = $1', [sku]);
    return result.rows[0];
};

// Create product
const createQuery = async (product) => {
    const existingProduct = await getProductBySKU(product.sku);
    if (existingProduct) {
        throw new Error('SKU already exists');
    }
    const result = await db.query(
        'INSERT INTO products (title, sku, image, price, description, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [product.title, product.sku, product.image, product.price, product.description, product.stock]
    );
    return result.rows[0];
};

const createProduct = async (products) => {
    const savedProducts = [];
    if (products.length === 0) {
        console.log('No products to save.');
        return savedProducts;
    }

    for (const product of products) {
        try {
            const savedProduct = await createQuery(product);
            savedProducts.push(savedProduct);
            console.log(`Product with SKU ${savedProduct.sku} has been added to the database.`);
        } catch (error) {
            if (error.message === 'SKU already exists') { 
                console.warn(`Product with SKU ${product.sku} already exists. Skipping.`);
            } else {
                console.error(`Failed to save product with SKU ${product.sku}: ${error.message}`);
                return error;
            }
        }
    }
    return savedProducts;
};

// Get all products
const getAllProducts = async (offset, limit) => {
    const result = await db.query('SELECT * FROM products OFFSET $1 LIMIT $2', [offset, limit]);
    return result.rows;
};

// Update product
const updateProduct = async (sku, updates) => {
    try {
        console.log('Updating product:', updates, sku);
        const result = await db.query(
            'UPDATE products SET title = $1, image = $2, price = $3, description = $4 WHERE sku = $5 RETURNING *',
            [updates.title, updates.image, updates.price, updates.description, sku]
        );
        return result.rows[0];
    } catch (error) {
        console.error(`Failed to update product with SKU ${sku}: ${error.message}`);
        return error;
    }
};

// Delete product and associated transactions
const deleteProduct = async (sku) => {
    await db.query('DELETE FROM transactions WHERE sku = $1', [sku]);
    await db.query('DELETE FROM products WHERE sku = $1', [sku]);
};

module.exports = {
    getProductBySKU,
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
};
