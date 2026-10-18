// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

// Define an API endpoint route pointing to our controller logic function
router.post('/register', authController.registerStudent);

module.exports = router;
