const request = require('supertest');
const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Mock routes
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: 'Protected route accessed', user: req.user });
});

app.get('/api/admin', protect, admin, (req, res) => {
    res.json({ message: 'Admin route accessed' });
});

describe('Auth Middleware', () => {
    let token;
    let adminToken;
    let userId;

    beforeAll(async () => {
        // Create a user
        const user = await User.create({
            name: 'Middleware User',
            email: 'middleware@example.com',
            password: 'password123',
        });
        userId = user._id;
        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Create an admin
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            isAdmin: true,
        });
        adminToken = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    it('should allow access with valid token', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe('middleware@example.com');
    });

    it('should deny access with no token', async () => {
        const res = await request(app).get('/api/protected');
        expect(res.statusCode).toEqual(401);
    });

    it('should deny access with invalid token', async () => {
        const res = await request(app)
            .get('/api/protected')
            .set('Authorization', 'Bearer invalidtoken');
        expect(res.statusCode).toEqual(401);
    });

    it('should allow admin access to admin route', async () => {
        const res = await request(app)
            .get('/api/admin')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should deny non-admin access to admin route', async () => {
        const res = await request(app)
            .get('/api/admin')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(401);
    });
});
