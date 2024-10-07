const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validator = require('validator');

//user signup function
const userSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      if(name !== undefined && email !== undefined && password !== undefined){
        //remove trailing spaces
        const absName = name.trim();
        const absEmail = email.trim();
        if(!validator.isEmpty(absName) && !validator.isEmpty(absEmail) && !validator.isEmpty(password) && validator.isEmail(absEmail)){
          // Check if the user already exists
          let isUser = await User.findOne({ email : absEmail });
          if (isUser) {
            return res.status(400).json({ msg: 'User already exists' });
          }
          
          let user = new User({ name: absName, email: absEmail, password: password });
          // Create new user
          await user.save();
      
          // Generate JWT token
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
          res.status(201).json({ token });
        } else {
          res.status(400).json({ msg: 'Bad Request' });
        }
      } else {
        res.status(400).json({ msg: 'Bad Request' });
      }
      
    } catch (err) {
      // console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
}

//user login function
const userLogin = async (req,res) => {
    const { email, password } = req.body;
    //remove trailing spaces
    const absEmail = email.trim();
    try {
      const user = await User.findOne({ email : absEmail });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {       
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token });
    } catch (err) {
      // console.error(err);
      res.status(500).json({ msg: 'Server error' });
    }
}

module.exports = {
  userSignup : userSignup,
  userLogin : userLogin
}