const mongoose = require('mongoose');

describe('Basic Test', () => {
    it('should connect to the test database', () => {
        expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });

    it('should run a basic math test', () => {
        expect(1 + 1).toBe(2);
    });
});
