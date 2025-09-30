const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, password });

    if (user) {
        res.status(201).json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || null,
            },
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || null,
            },
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

// Get user profile
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('followers', 'username')
        .populate('following', 'username');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
};

module.exports = { registerUser, authUser, getUserProfile };
