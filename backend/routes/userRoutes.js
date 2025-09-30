const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { followUser, unfollowUser, getUser } = require('../controllers/userController');

router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/:id', protect, getUser); // Get user details (for profile)

module.exports = router;
