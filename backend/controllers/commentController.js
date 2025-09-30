const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body; // <-- frontend sends { text: "..." }
    const postId = req.params.postId;

    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

    const comment = await Comment.create({
      user: req.user._id,
      post: postId,
      content: text
    });

    // Push comment id into Post.comments
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    // populate user before returning
    await comment.populate('user', 'username avatar');

    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error adding comment' });
  }
};


// Get comments for a post
const getComments = async (req, res) => {
    const postId = req.params.postId;
    const comments = await Comment.find({ post: postId })
        .populate('user', 'username avatar')
        .sort({ createdAt: 1 });

    res.json(comments);
};

module.exports = { addComment, getComments };
