const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

beforeAll(async () => {
    // Use a separate test database
    const testURI = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/sweetshop_test';
    try {
        await mongoose.connect(testURI);
    } catch (err) {
        console.error('Test DB Connection Error:', err);
    }
});

afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
});
