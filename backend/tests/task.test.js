const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Assuming your Express app is exported from server.js
const User = require('../models/User');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

let token; // JWT token to authenticate requests
let user_id;

// Setup and teardown
beforeAll(async () => {
  // Connect to test database
  const mongoURI = process.env.MONGO_TEST_URI; // Use a test database
  await mongoose.connect(mongoURI);

  // Create a user and generate a JWT token for that user
  const user = await User.create({
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'Password123',
  });

  user_id = user._id;
  token = jwt.sign({ user: { id: user._id } }, jwtSecret); // Create a valid JWT token
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase(); // Cleanup test database after all tests
  await mongoose.connection.close();
});

  // Test for fetching all tasks
  describe('GET /api/tasks', () => {
    it('should return all tasks for the authenticated user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('x-auth-token', token); // Send JWT token

      expect(res.statusCode).toEqual(200); // Expect status code 200 (OK)
      expect(Array.isArray(res.body)).toBeTruthy(); // Response should be an array
    });
  });

  // Test for creating a new task
  describe('POST /api/tasks', () => {
    it('should create a new task for the authenticated user', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'This is a test task',
        priority: 'Medium',
        status: 'To Do',
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token) // Send JWT token
        .send(newTask); // Send task data

      expect(res.statusCode).toEqual(201); // Expect status code 201 (Created)
      expect(res.body).toHaveProperty('_id'); // Task should have an ID
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.description).toBe(newTask.description);
      expect(res.body.priority).toBe(newTask.priority);
      expect(res.body.status).toBe(newTask.status);
    });

    it('should not create a task without a title', async () => {
      const incompleteTask = {
        description: 'This task is missing a title',
        priority: 'Low',
      };

      const res = await request(app)
        .post('/api/tasks')
        .set('x-auth-token', token)
        .send(incompleteTask);

      expect(res.statusCode).toEqual(400); // Expect status code 400 (Bad Request)
      expect(res.body).toHaveProperty('msg','Bad Request');
    });
  });

  // Test for updating a task
  describe('PUT /api/tasks/:id', () => {
    let taskId;

    beforeAll(async () => {
      const task = await Task.create({
        title: 'Task to be updated',
        description: 'Original description',
        priority: 'Low',
        status: 'To Do',
        userId: user_id, // Fake user ID (should be current user's ID in real case)
      });
      taskId = task._id; // Get the ID of the created task
    });

    it('should update a task', async () => {
      const updatedTask = {
        title: 'Updated Task Title',
        description: 'Updated description',
        priority: 'High',
        status: 'In Progress',
        // userId: user_id, // Fake user ID (should be current user's ID in real case)
      };

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('x-auth-token', token) // Send JWT token
        .send(updatedTask);

      expect(res.statusCode).toEqual(200); // Expect status code 200 (OK)
      expect(res.body.title).toBe(updatedTask.title);
      expect(res.body.description).toBe(updatedTask.description);
      expect(res.body.priority).toBe(updatedTask.priority);
      expect(res.body.status).toBe(updatedTask.status);
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistingId = new mongoose.Types.ObjectId(); // Generate a non-existing task ID

      const res = await request(app)
        .put(`/api/tasks/${nonExistingId}`)
        .set('x-auth-token', token)
        .send({ title: 'Non-existing task' });

      expect(res.statusCode).toEqual(404); // Expect status code 404 (Not Found)
      expect(res.body).toHaveProperty('msg', 'Task not found');
    });
  });

  // Test for deleting a task
  describe('DELETE /api/tasks/:id', () => {
    let taskId;

    beforeAll(async () => {
      const task = await Task.create({
        title: 'Task to be deleted',
        description: 'This task will be deleted',
        priority: 'Low',
        status: 'To Do',
      });
      taskId = task._id; // Get the ID of the created task
    });

    it('should delete a task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('x-auth-token', token) // Send JWT token

      expect(res.statusCode).toEqual(200); // Expect status code 200 (OK)
      expect(res.body).toHaveProperty('msg', 'Task deleted');
    });

    it('should return 404 if task does not exist', async () => {
      const nonExistingId = new mongoose.Types.ObjectId(); // Generate a non-existing task ID

      const res = await request(app)
        .delete(`/api/tasks/${nonExistingId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toEqual(404); // Expect status code 404 (Not Found)
      expect(res.body).toHaveProperty('msg', 'Task not found');
    });
  });
