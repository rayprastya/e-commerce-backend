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


describe('Transaction Endpoints', () => {
    let product, transaction;

    beforeAll(async () => {
        const res = await db.query(`
            INSERT INTO products (title, sku, image, price, description, stock)
            VALUES ('Test Product', 'TESTSKU1', 'http://example.com/image.jpg', 100, 'Test Description', 10) RETURNING *
        `);
        console.log('res.rows[0]', res.rows[0]);
        product = res.rows[0];
    });

    afterAll(async () => {
        await db.query('DELETE FROM products WHERE sku = $1', [product.sku]);
    });

    test('POST /transactions', async () => {
        const newTransaction = {
            sku: product.sku,
            qty: 2
        };
        const res = await request(server.listener)
            .post('/transactions')
            .send(newTransaction);
        expect(res.statusCode).toBe(201);
        expect(res.body.sku).toBe(newTransaction.sku);
        expect(res.body.amount).toBe(product.price * newTransaction.qty);

        transaction = res.body;
    });

    test('GET /transactions', async () => {
        const res = await request(server.listener)
            .get('/transactions')
            .query({ offset: 0, limit: 10 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body).toHaveLength(1);
    });

    test('GET /transactions/:id', async () => {
        const res = await request(server.listener).get(`/transactions/${transaction.id}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(transaction.id);
    });

    test('PUT /transactions/:id', async () => {
        const updatedTransaction = {
            sku: transaction.sku,
            qty: 3
        };
        const res = await request(server.listener)
            .put(`/transactions/${transaction.id}`)
            .send(updatedTransaction);
        expect(res.statusCode).toBe(200);
        expect(res.body.qty).toBe(updatedTransaction.qty);

        const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transaction.id]);
        expect(result.rows[0].qty).toBe(updatedTransaction.qty);

        transaction = res.body;
    });

    test('DELETE /transactions/:id', async () => {
        const res = await request(server.listener).delete(`/transactions/${transaction.id}`);
        expect(res.statusCode).toBe(204);

        const result = await db.query('SELECT * FROM transactions WHERE id = $1', [transaction.id]);
        expect(result.rows).toHaveLength(0);
    });
});
