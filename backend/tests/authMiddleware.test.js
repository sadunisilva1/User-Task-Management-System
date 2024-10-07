const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

let user_id;

beforeAll(async () => {
    // Connect to the test database
    const mongoURI = process.env.MONGO_TEST_URI; // Use a test database
    await mongoose.connect(mongoURI);
  
    const user = await User.create({
        name: 'Middleware Test User',
        email: 'middlewaretestuser@example.com',
        password: 'Password123',
    });
    
    user_id = user._id;
  });
  
  afterAll(async () => {
    // Disconnect and clean up
    await mongoose.connection.db.dropDatabase(); // Drop test database after tests
    await mongoose.connection.close();
  });

describe('Auth Middleware', () => {
  it('should deny access without a token', async () => {
    const res = await request(app).get('/api/tasks'); // Endpoint protected by the auth middleware
    expect(res.statusCode).toEqual(401); // Expect HTTP status 401 (Unauthorized)
    expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
  });

  it('should deny access with an invalid token', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('x-auth-token', 'invalidtoken'); // Pass an invalid token

    expect(res.statusCode).toEqual(401); // Expect HTTP status 401 (Unauthorized)
    expect(res.body).toHaveProperty('msg', 'Token is not valid');
  });

  it('should allow access with a valid token', async () => {
    // Create a valid token for a user
    // const user = new User({ name: 'John', email: 'john@example.com', password: 'Password123' });
    const token = jwt.sign({ user: { id: user_id } }, jwtSecret);

    const res = await request(app)
      .get('/api/tasks')
      .set('x-auth-token', token); // Pass the valid token

    expect(res.statusCode).toEqual(200); // Expect HTTP status 200 (OK)
  });
});
