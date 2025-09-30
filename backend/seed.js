require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');

(async function seed() {
  try {
    // connect to DB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB ✅');

    // clean collections
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    console.log('Old data cleared 🧹');

    // create users
    const users = await User.insertMany([
      { username: 'Landoh', email: 'landoh@example.com', password: '123456' },
      { username: 'Ada', email: 'ada@example.com', password: '123456' },
      { username: 'Mike', email: 'mike@example.com', password: '123456' }
    ]);

    console.log('Users created:', users.map(u => u.username));

    // create posts
    const posts = await Post.insertMany([
      { user: users[0]._id, content: 'Welcome to our mini social app 🚀' },
      { user: users[1]._id, content: 'Loving this new platform 😎' },
      { user: users[2]._id, content: 'Just had a great lunch 🍔🍟' }
    ]);

    console.log('Posts created:', posts.map(p => p.content));

    // create comments
    const comments = await Comment.insertMany([
      { user: users[1]._id, post: posts[0]._id, content: 'This is awesome!' },
      { user: users[2]._id, post: posts[0]._id, content: 'Yeah, let’s grow it!' },
      { user: users[0]._id, post: posts[1]._id, content: 'Glad you like it 🙌' }
    ]);

    console.log('Comments created ✅');

    // push comments into related posts
    for (const comment of comments) {
      await Post.findByIdAndUpdate(comment.post, { $push: { comments: comment._id } });
    }

    // add some likes
    await Post.findByIdAndUpdate(posts[0]._id, { $push: { likes: users[2]._id } });
    await Post.findByIdAndUpdate(posts[1]._id, { $push: { likes: users[0]._id } });

    console.log('Seed complete 🌱');
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
