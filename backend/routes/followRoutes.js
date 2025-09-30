const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { followUser } = require('../controllers/followController');

// Follow/unfollow a user
router.put('/:userId', protect, followUser);

module.exports = router;
