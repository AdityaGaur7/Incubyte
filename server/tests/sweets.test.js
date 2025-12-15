const request = require('supertest');
const app = require('../index');
const User = require('../models/User');
const Sweet = require('../models/Sweet');
const jwt = require('jsonwebtoken');

describe('Sweets Endpoints', () => {
    let adminToken;
    let userToken;

    beforeEach(async () => {
        await Sweet.deleteMany({});
        await User.deleteMany({});

        // Create admin
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        });
        adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create user
        const user = await User.create({
            name: 'User',
            email: 'user@example.com',
            password: 'password123',
        });
        userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    describe('POST /api/sweets', () => {
        it('should allow admin to create a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Chocolate Cake',
                    category: 'Cake',
                    price: 20,
                    quantity: 10,
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body.name).toBe('Chocolate Cake');
        });

        it('should deny non-admin from creating a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Chocolate Cake',
                    category: 'Cake',
                    price: 20,
                    quantity: 10,
                });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/sweets', () => {
        it('should return all sweets', async () => {
            await Sweet.create({ name: 'Sweet 1', category: 'C1', price: 10, quantity: 5 });
            await Sweet.create({ name: 'Sweet 2', category: 'C2', price: 15, quantity: 5 });

            const res = await request(app)
                .get('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(2);
        });
    });

    describe('GET /api/sweets/search', () => {
        it('should search sweets by name', async () => {
            await Sweet.create({ name: 'Chocolate Cake', category: 'Cake', price: 20, quantity: 10 });
            await Sweet.create({ name: 'Vanilla Ice Cream', category: 'Ice Cream', price: 10, quantity: 10 });

            const res = await request(app)
                .get('/api/sweets/search?query=Chocolate')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Chocolate Cake');
        });

        it('should filter by category', async () => {
            await Sweet.create({ name: 'Chocolate Cake', category: 'Cake', price: 20, quantity: 10 });
            await Sweet.create({ name: 'Vanilla Ice Cream', category: 'Ice Cream', price: 10, quantity: 10 });

            const res = await request(app)
                .get('/api/sweets/search?category=Ice Cream')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Vanilla Ice Cream');
        });

        it('should filter by price range', async () => {
            await Sweet.create({ name: 'Cheap Candy', category: 'Candy', price: 5, quantity: 10 });
            await Sweet.create({ name: 'Expensive Cake', category: 'Cake', price: 50, quantity: 10 });

            const res = await request(app)
                .get('/api/sweets/search?minPrice=10&maxPrice=60')
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].name).toBe('Expensive Cake');
        });
    });

    describe('POST /api/sweets/:id/purchase', () => {
        it('should decrease quantity on purchase', async () => {
            const sweet = await Sweet.create({ name: 'Candy', category: 'Candy', price: 1, quantity: 10 });

            const res = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toBe(9);
        });

        it('should fail if out of stock', async () => {
            const sweet = await Sweet.create({ name: 'Candy', category: 'Candy', price: 1, quantity: 0 });

            const res = await request(app)
                .post(`/api/sweets/${sweet._id}/purchase`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /api/sweets/:id/restock', () => {
        it('should increase quantity on restock (admin)', async () => {
            const sweet = await Sweet.create({ name: 'Candy', category: 'Candy', price: 1, quantity: 10 });

            const res = await request(app)
                .post(`/api/sweets/${sweet._id}/restock`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.quantity).toBe(11);
        });
    });
});
