const Task = require('../models/Task');
const validator = require('validator');

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

const addTask = async (req, res) => {
    const { title, description, priority, status } = req.body;
    try {
      if(
        (title !== undefined && !validator.isEmpty(title)) &&
        (description !== undefined && !validator.isEmpty(description)) &&
        (priority !== undefined && !validator.isEmpty(priority)) &&
        (status !== undefined && !validator.isEmpty(status))
      ){
        const task = new Task({
          title,
          description,
          priority,
          status,
          userId: req.user
        });
        await task.save();
        res.status(201).json(task);
      } else {
        res.status(400).json({ msg: 'Bad Request' });
      }
      
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
}

const updateTask = async (req, res) => {
    const { title, description, priority, status } = req.body;
    try {
      let task = await Task.findById(req.params.id);
      if (!task) {
      // if (!task || task.userId.toString() !== req.user) {
        return res.status(404).json({ msg: 'Task not found' });
      }
  
      task = await Task.findByIdAndUpdate(req.params.id, { title, description, priority, status }, { new: true });
      res.json(task);
    } catch (err) {
        // console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
}

const deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
        // if (!task || task.userId.toString() !== req.user) {
          return res.status(404).json({ msg: 'Task not found' });
        }
    
        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task deleted' });
    } catch (err) {
        // console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }    
}


module.exports = {
    getTasks : getTasks,
    addTask : addTask,
    updateTask : updateTask,
    deleteTask : deleteTask
  }