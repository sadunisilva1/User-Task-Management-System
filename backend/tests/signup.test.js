const request = require('supertest');
const app = require('../server'); // Assuming your Express app is exported in server.js
const mongoose = require('mongoose');
// const User = require('../models/User'); // Import the User model
const dotenv = require('dotenv');

dotenv.config();

beforeAll(async () => {
  // Connect to the test database
  const mongoURI = process.env.MONGO_TEST_URI; // Use a test database
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Disconnect and clean up
  await mongoose.connection.db.dropDatabase(); // Drop test database after tests
  await mongoose.connection.close();
});

describe('POST /api/auth/signup', () => {
  it('should create a new user with valid data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Williams',
        email: 'john.Williams@example.com',
        password: 'Password123',
      });

    expect(res.statusCode).toEqual(201); // Expect HTTP status 201 (Created)
    expect(res.body).toHaveProperty('token'); // Expect a token in the response
  });

  it('should not create a new user with an existing email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'John Williams',
        email: 'john.Williams@example.com', // Reusing the same email
        password: 'Password123',
      });

    expect(res.statusCode).toEqual(400); // Expect HTTP status 400 (Bad Request)
    expect(res.body).toHaveProperty('msg','User already exists'); // Expect an error message
  });

  it('should not create a user with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        name: '',
        email: 'invalid-email', // Invalid email
        password: 'short', // Invalid password (too short)
      });

    expect(res.statusCode).toEqual(400); // Expect HTTP status 400 (Bad Request)
    expect(res.body).toHaveProperty('msg','Bad Request'); // Expect an error message
  });
});
