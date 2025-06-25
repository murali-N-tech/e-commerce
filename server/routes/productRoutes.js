// server/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Public routes for fetching products (with search/filter/pagination)
router.route('/').get(getProducts);

// Admin routes for managing products
router.route('/admin') // You might have this route for admin-specific product list
  .post(protect, admin, createProduct); // Create product for admin
router.route('/admin/:id') // Admin routes for specific products
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

// Public route for fetching single product by ID
router.route('/:id').get(getProductById);

module.exports = router;
