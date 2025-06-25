// server/routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,         // For admin
  updateOrderToDelivered, // For admin
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware'); // Import admin middleware

// Routes for creating and fetching all orders (admin only)
router.route('/')
  .post(protect, addOrderItems) // Create a new order (private, for logged-in user)
  .get(protect, admin, getOrders); // Get all orders (private, admin only)

// Route for getting logged in user's orders
router.route('/myorders').get(protect, getMyOrders);

// Routes for specific order by ID
router.route('/:id').get(protect, getOrderById); // Get single order by ID (private, user or admin)
router.route('/:id/pay').put(protect, updateOrderToPaid); // Update order to paid (private)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // Update order to delivered (private, admin only)


module.exports = router;
