const transactionController = require('../controllers/transactionController');

module.exports = [
    { method: 'GET', path: '/transactions', handler: transactionController.getAllTransactions },
    { method: 'GET', path: '/transactions/{id}', handler: transactionController.getTransactionById },
    { method: 'POST', path: '/transactions', handler: transactionController.createTransaction },
    { method: 'PUT', path: '/transactions/{id}', handler: transactionController.updateTransaction },
    { method: 'DELETE', path: '/transactions/{id}', handler: transactionController.deleteTransaction },
];
