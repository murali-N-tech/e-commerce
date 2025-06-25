// server/controllers/userController.js

const User = require('../models/User'); // Import the User model
const generateToken = require('../utils/generateToken'); // Import token generation utility
const asyncHandler = require('express-async-handler'); // For handling async errors

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad request
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook in the User model
  });

  if (user) {
    res.status(201).json({ // 201 status for successful creation
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role
      token: generateToken(user._id, user.role), // Pass role to generateToken
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role
      token: generateToken(user._id, user.role), // Pass role to generateToken
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // The 'protect' middleware adds the user object to the request (req.user)
  // based on the token.
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Include role
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id); // Get user from protect middleware

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Only update password if a new one is provided
    if (req.body.password) {
      user.password = req.body.password; // Mongoose pre-save hook will hash this
    }

    const updatedUser = await user.save(); // Save the updated user

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role, // Include role
      token: generateToken(updatedUser._id, updatedUser.role), // Generate new token with updated role if changed
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get all users (admin only)
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// Delete user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
};
