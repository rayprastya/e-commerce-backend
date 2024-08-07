const transactionRepository = require('../repositories/transactionRepository');
const productRepository = require('../repositories/productRepository');

const getAllTransactions = async (offset, limit) => {
    return await transactionRepository.getAllTransactions(offset, limit);
};

const getTransactionById = async (id) => {
    return await transactionRepository.getTransactionById(id);
};

const createTransaction = async (transaction) => {
    const product = await productRepository.getProductBySKU(transaction.sku);
    if (!product) throw new Error('Product not found');
    if (product.stock + transaction.qty < 0) throw new Error('Insufficient stock');

    transaction.amount = product.price * transaction.qty;
    const createdTransaction = await transactionRepository.createTransaction(transaction);

    product.stock += transaction.qty;
    await productRepository.updateProduct(transaction.sku, product);

    return createdTransaction;
};

const updateTransaction = async (id, transaction) => {
    const existingTransaction = await transactionRepository.getTransactionById(id);
    if (!existingTransaction) throw new Error('Transaction not found');

    const product = await productRepository.getProductBySKU(transaction.sku);
    if (!product) throw new Error('Product not found');
    if (product.stock - existingTransaction.qty + transaction.qty < 0) throw new Error('Insufficient stock');

    transaction.amount = product.price * transaction.qty;
    const updatedTransaction = await transactionRepository.updateTransaction(id, transaction);

    product.stock = product.stock - existingTransaction.qty + transaction.qty;
    await productRepository.updateProduct(transaction.sku, product);

    return updatedTransaction;
};

const deleteTransaction = async (id) => {
    const transaction = await transactionRepository.getTransactionById(id);
    if (!transaction) throw new Error('Transaction not found');

    const product = await productRepository.getProductBySKU(transaction.sku);
    product.stock -= transaction.qty;
    await productRepository.updateProduct(transaction.sku, product);

    await transactionRepository.deleteTransaction(id);
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
};
