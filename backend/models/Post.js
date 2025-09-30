const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String // URL or filename 
  },
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }
  ]
}, { timestamps: true });  // adds createdAt & updatedAt

module.exports = mongoose.model('Post', PostSchema);
