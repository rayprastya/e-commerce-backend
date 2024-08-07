const Joi = require('joi');

const transactionSchema = Joi.object({
    sku: Joi.string().required(),
    qty: Joi.number().required(),
    amount: Joi.number().optional(),
});

module.exports = transactionSchema;
