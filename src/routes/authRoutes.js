const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/api/signup', signup);
router.post('/api/login', login);

// Protected routes
router.get('/getProfileInfoOfUser/:userName', auth, getProfile);

module.exports = router; 