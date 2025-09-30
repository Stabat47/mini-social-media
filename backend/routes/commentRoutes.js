const express = require('express');
const router = express.Router({ mergeParams: true });
const { protect } = require('../middlewares/authMiddleware');
const { addComment, getComments } = require('../controllers/commentController');

// Add comment to a post
router.post('/:postId', protect, addComment);

// Get comments for a post
router.get('/:postId', protect, getComments);

module.exports = router;
