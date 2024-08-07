const request = require('supertest');
const db = require('../src/config/db');
const initServer = require('./serverTest');

let server;

beforeAll(async () => {
    server = await initServer();
});

afterAll(async () => {
    await server.stop();
    await db.end();
});


describe('Product Endpoints', () => {
    let product;

    beforeAll(async () => {
        const res = await db.query(`
            INSERT INTO products (title, sku, image, price, description, stock)
            VALUES ('Test Product', 'TESTSKU', 'http://example.com/image.jpg', 100, 'Test Description', 10) RETURNING *
        `);
        product = res.rows[0];
    });

    afterAll(async () => {
        await db.query('DELETE FROM products WHERE sku = $1', [product.sku]);
    });

    test('GET /products', async () => {
        const res = await request(server.listener)
            .get('/products')
            .query({ offset: 0, limit: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
    });

    test('GET /products/:sku', async () => {
        const res = await request(server.listener).get(`/products/${product.sku}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.sku).toBe(product.sku);
    });

    test('POST /products', async () => {
        const newProduct = {
            title: 'New Product',
            sku: 'NEWSKU',
            image: 'http://example.com/new_image.jpg',
            price: 200,
            description: 'New Description',
            stock: 5
        };
        const res = await request(server.listener)
            .post('/products')
            .send(newProduct);
        expect(res.statusCode).toBe(201);
        expect(res.body.sku).toBe(newProduct.sku);

        await db.query('DELETE FROM products WHERE sku = $1', [newProduct.sku]);
    });

    test('PUT /products/:sku', async () => {
        const updatedProduct = {
            title: 'Updated Product',
            image: 'http://example.com/updated_image.jpg',
            price: 150,
            description: 'Updated Description',
            stock: 8
        };
        const res = await request(server.listener)
            .put(`/products/${product.sku}`)
            .send(updatedProduct);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(updatedProduct.title);

        // Ensure database is updated
        const result = await db.query('SELECT * FROM products WHERE sku = $1', [product.sku]);
        expect(result.rows[0].title).toBe(updatedProduct.title);
    });

    test('DELETE /products/:sku', async () => {
        const res = await request(server.listener).delete(`/products/${product.sku}`);
        expect(res.statusCode).toBe(204);

        const result = await db.query('SELECT * FROM products WHERE sku = $1', [product.sku]);
        expect(result.rows).toHaveLength(0);
    });
});
