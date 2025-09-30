const User = require('../models/User');

exports.followUser = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!targetUser) return res.status(404).json({ message: 'User not found' });

  if (!currentUser.following.includes(targetUser._id)) {
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);
    await currentUser.save();
    await targetUser.save();
  }

  res.json({ following: currentUser.following, followers: targetUser.followers });
};

exports.unfollowUser = async (req, res) => {
  const targetUser = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!targetUser) return res.status(404).json({ message: 'User not found' });

  currentUser.following = currentUser.following.filter(id => id.toString() !== targetUser._id.toString());
  targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUser._id.toString());

  await currentUser.save();
  await targetUser.save();

  res.json({ following: currentUser.following, followers: targetUser.followers });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};
