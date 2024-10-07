// tests/login.test.js
const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User'); // Import the User model
const dotenv = require('dotenv');

dotenv.config();

beforeAll(async () => {
  // Connect to the test database
  const mongoURI = process.env.MONGO_TEST_URI; // Use a test database
  await mongoose.connect(mongoURI);

  // Create a user for login tests
  await User.create({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'Password123', // Password will be hashed in the model
  });
});

afterAll(async () => {
  // Disconnect and clean up
  await mongoose.connection.db.dropDatabase(); // Drop test database after tests
  await mongoose.connection.close();
});

describe('POST /api/auth/login', () => {
  it('should log in a user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'Password123',
      });

    expect(res.statusCode).toEqual(200); // Expect HTTP status 200 (OK)
    expect(res.body).toHaveProperty('token'); // Expect a JWT token
  });

  it('should not log in a user with an incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'WrongPassword',
      });

    expect(res.statusCode).toEqual(400); // Expect HTTP status 400 (Bad Request)
    expect(res.body).toHaveProperty('msg','Invalid credentials'); // Expect an error message
  });

  it('should not log in a user with a non-existing email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password123',
      });

    expect(res.statusCode).toEqual(400); // Expect HTTP status 400 (Bad Request)
    expect(res.body).toHaveProperty('msg','Invalid credentials'); // Expect an error message
  });
});
