const User = require('../models/User');

// Follow or unfollow a user
const followUser = async (req, res) => {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: 'User not found' });
    if (userToFollow._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "You can't follow yourself" });
    }

    if (currentUser.following.includes(userToFollow._id)) {
        // Unfollow
        currentUser.following = currentUser.following.filter(
            id => id.toString() !== userToFollow._id.toString()
        );
        userToFollow.followers = userToFollow.followers.filter(
            id => id.toString() !== currentUser._id.toString()
        );
    } else {
        // Follow
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({
        currentUserFollowing: currentUser.following,
        userFollowers: userToFollow.followers
    });
};

module.exports = { followUser };
