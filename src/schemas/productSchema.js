const Joi = require('joi');

const productSchema = Joi.object({
    title: Joi.string().required(),
    sku: Joi.string().required(),
    image: Joi.string().uri().optional(),
    price: Joi.number().required(),
    description: Joi.string().allow(null, ''),
    stock: Joi.number().default(0),
});

module.exports = productSchema;
