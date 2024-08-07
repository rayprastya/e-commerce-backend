const transactionService = require('../services/transactionService');
const transactionSchema = require('../schemas/transactionSchema');

// Create transaction
const createTransaction = async (request, h) => {
    const { error, value } = transactionSchema.validate(request.payload);
    if (error) return h.response({ message: error.details[0].message }).code(400);

    try {
        const transaction = await transactionService.createTransaction(value);
        return h.response(transaction).code(201);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Get all transactions
const getAllTransactions = async (request, h) => {
    try {
        const transactions = await transactionService.getAllTransactions();
        return h.response(transactions).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Get transaction by ID
const getTransactionById = async (request, h) => {
    try {
        const transaction = await transactionService.getTransactionById(request.params.id);
        if (!transaction) {
            return h.response({ message: 'Transaction not found' }).code(404);
        }
        return h.response(transaction).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Update transaction
const updateTransaction = async (request, h) => {
    const { id } = request.params;
    const { error, value } = transactionSchema.validate(request.payload);
    if (error) return h.response({ message: error.details[0].message }).code(400);

    try {
        const transaction = await transactionService.updateTransaction(id, value);
        return h.response(transaction).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

// Delete transaction
const deleteTransaction = async (request, h) => {
    const { id } = request.params;

    try {
        await transactionService.deleteTransaction(id);
        return h.response({ message: 'Transaction deleted' }).code(200);
    } catch (err) {
        return h.response({ message: err.message }).code(400);
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
