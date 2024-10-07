const express = require('express');
const router = express.Router();

let authController = require('../controllers/auth.controller');

router.post('/signup',authController.userSignup); // Signup route
router.post('/login',authController.userLogin); // Login route

module.exports = router;
