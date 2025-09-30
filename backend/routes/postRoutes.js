const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createPost, getPosts, likePost, getFeedPosts, getUserPosts, editPost, deletePost } = require('../controllers/postController');

const upload = require('../middlewares/uploadMiddleware');

// Create post with image upload
router.post('/', protect, upload.single('image'), createPost);

// Get posts by user ID
router.get('/user/:userId', protect, getUserPosts);


// User feed (posts from following + self)
router.get('/feed', protect, getFeedPosts);


// Create post
router.post('/', protect, createPost);

// Get all posts
router.get('/', protect, getPosts);

// Like/unlike post
router.put('/:id/like', protect, likePost);

// Edit post
router.put('/:id', protect, editPost);   

// Delete post
router.delete('/:id', protect, deletePost);


module.exports = router;
