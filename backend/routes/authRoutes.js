const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Get current logged-in user
router.get('/me', protect, (req, res) => {
  // req.user comes from protect middleware
  res.json(req.user);
});

// Get another user's profile by ID
router.get('/user/:id', protect, getUserProfile);

// Register
router.post('/register', registerUser);

// Login
router.post('/login', authUser);

module.exports = router;
