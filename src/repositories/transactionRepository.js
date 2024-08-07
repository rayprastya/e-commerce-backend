const db = require('../config/db');
const productRepository = require('./productRepository');

// Create transaction
const createTransaction = async (transaction) => {
    const product = await productRepository.getProductBySKU(transaction.sku);
    if (!product) {
        throw new Error('Product not found');
    }
    if (product.stock + transaction.qty < 0) {
        throw new Error('Insufficient stock');
    }

    const amount = product.price * transaction.qty;

    await db.query(
        'INSERT INTO transactions (sku, qty, amount) VALUES ($1, $2, $3) RETURNING *',
        [transaction.sku, transaction.qty, amount]
    );

    // Update stock
    await db.query(
        'UPDATE products SET stock = stock + $1 WHERE sku = $2',
        [transaction.qty, transaction.sku]
    );

    return { sku: transaction.sku, qty: transaction.qty};
};

// Get all transactions
const getAllTransactions = async () => {
    const result = await db.query('SELECT * FROM transactions');
    return result.rows;
};

// Get transaction by ID
const getTransactionById = async (id) => {
    const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return result.rows[0];
};

// Update transaction
const updateTransaction = async (id, updates) => {
    const product = await productRepository.getProductBySKU(updates.sku);
    if (!product) {
        throw new Error('Product not found');
    }
    if (product.stock + updates.qty < 0) {
        throw new Error('Insufficient stock');
    }

    const amount = product.price * updates.qty;

    // TODO: disabled first, enable it if sku want to be updated also
    // const result = await db.query(
    //     'UPDATE transactions SET sku = $1, qty = $2 WHERE id = $3 RETURNING *',
    //     [updates.sku, updates.qty, id]
    // );

    const result = await db.query(
        'UPDATE transactions SET qty = $1, amount=$2 WHERE id = $3 RETURNING *',
        [updates.qty, amount, id]
    );

    // Update stock
    await db.query(
        'UPDATE products SET stock = stock + $1 WHERE sku = $2',
        [updates.qty, updates.sku]
    );

    return result.rows[0];
};

// Delete transaction
const deleteTransaction = async (id) => {
    const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
