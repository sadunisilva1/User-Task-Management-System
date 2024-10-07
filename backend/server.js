const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);


if (process.env.NODE_ENV !== 'test') {
  // MongoDB connection
  mongoose.connect(process.env.MONGO_URI).
  catch(err => console.error('MongoDB connection error:', err));
  console.log('MongoDB connected');

  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
} else {
  module.exports = app
}
