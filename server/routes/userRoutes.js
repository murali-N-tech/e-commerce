// server/routes/userRoutes.js

const express = require('express');
const router = express.Router(); // Create an Express router
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,         // <-- ADD
  deleteUser,       // <-- ADD
} = require('../controllers/userController'); // Import user controller functions
const { protect } = require('../middleware/authMiddleware'); // Import authentication middleware
const { admin } = require('../middleware/adminMiddleware');

// Public routes: no authentication required
router.post('/register', registerUser); // Route for user registration
router.post('/login', loginUser);       // Route for user login

// Protected routes: require the 'protect' middleware
// .route('/') allows chaining different HTTP methods to the same path
router.route('/profile')
  .get(protect, getUserProfile)       // GET user profile (requires token)
  .put(protect, updateUserProfile);   // UPDATE user profile (requires token)

// Admin: Get all users & delete user
router.route('/').get(protect, admin, getUsers); // GET /api/users (admin)
router.route('/:id').delete(protect, admin, deleteUser); // DELETE /api/users/:id (admin)

// Example admin-protected route (optional, for future use)
// router.get('/admin-dashboard', protect, admin, (req, res) => {
//   res.send('Welcome to the Admin Dashboard!');
// });

module.exports = router; // Export the router
