// server/routes/userRoutes.js

const express = require('express');
const router = express.Router(); // Create an Express router
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} = require('../controllers/userController'); // Import user controller functions
const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware
const { admin } = require('../middleware/adminMiddleware'); // Import admin middleware

// Public routes: no authentication required
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);       // Route for user login

// Protected user profile routes
// .route('/profile') allows chaining different HTTP methods to the same path
router.route('/profile')
  .get(protect, getUserProfile)       // GET user profile (requires token)
  .put(protect, updateUserProfile);   // UPDATE user profile (requires token)

// Admin routes
router.route('/')
  .get(protect, admin, getUsers);     // GET all users (admin only)

router.route('/:id')
  .delete(protect, admin, deleteUser); // DELETE a user by ID (admin only)

module.exports = router; // Export the router
