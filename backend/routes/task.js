const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

let taskController = require('../controllers/task.controller')
// Get all tasks for the logged-in user
router.get('/', authMiddleware,taskController.getTasks);// Get tasks
router.post('/', authMiddleware,taskController.addTask);// Add a new task
router.put('/:id', authMiddleware,taskController.updateTask);// Update a task
router.delete('/:id', authMiddleware,taskController.deleteTask);// Delete a task

module.exports = router;
