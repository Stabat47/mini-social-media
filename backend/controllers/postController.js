const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
const createPost = async (req, res) => {
  const { content } = req.body;
  let image = null;

  if (!content && !req.file) {
    return res.status(400).json({ message: 'Content or image is required' });
  }

  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  const post = await Post.create({
    user: req.user._id,
    content,
    image
  });

  res.status(201).json(post);
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatar' }
      });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// Like/Unlike a post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.likes.includes(req.user._id)) {
      // Unlike
      post.likes = post.likes.filter(user => user.toString() !== req.user._id.toString());
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get feed posts for current user
const getFeedPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    const posts = await Post.find({
      user: { $in: [...currentUser.following, req.user._id] }
    })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching feed' });
  }
};

// Get posts by specific user
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user posts' });
  }
};

// Edit a post
const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    post.content = req.body.content || post.content;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only allow the owner to delete
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();          // or await Post.findByIdAndDelete(req.params.id)
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);            // <--- watch your server console
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all functions
module.exports = {
  createPost,
  getPosts,
  likePost,
  getFeedPosts,
  getUserPosts,
  editPost,
  deletePost
};
