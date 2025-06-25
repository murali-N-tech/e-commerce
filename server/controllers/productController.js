// server/controllers/productController.js

const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products with search, filter, sort, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8; // Number of products per page
  const page = Number(req.query.pageNumber) || 1; // Current page number, default to 1

  // Keyword for search (case-insensitive)
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i', // Case-insensitive
        },
      }
    : {};

  // Category filter
  const category = req.query.category && req.query.category !== 'All'
    ? { category: req.query.category }
    : {};

  // Combine search and category filters
  const filter = { ...keyword, ...category };

  // Get count of products matching the filter (for pagination metadata)
  const count = await Product.countDocuments(filter);

  // Sorting options
  let sort = {};
  if (req.query.sortBy === 'price-asc') {
    sort = { price: 1 }; // Sort by price ascending
  } else if (req.query.sortBy === 'price-desc') {
    sort = { price: -1 }; // Sort by price descending
  } else {
    sort = { createdAt: -1 }; // Default sort by newest first
  }

  // Fetch products with pagination and sorting
  const products = await Product.find(filter)
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Respond with products, current page, and total number of pages
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne(); // Use deleteOne()
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    imageUrl,
    category,
    countInStock,
    rating,
    reviews,
    details
  } = req.body;

  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    category,
    countInStock,
    rating: rating || 0,
    reviews: reviews || 0,
    details: details || [],
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // You might want to update rating/reviews if they are user-submitted
    // For now, these are not directly editable by admin here.

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
