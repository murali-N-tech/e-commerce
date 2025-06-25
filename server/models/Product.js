// server/models/Product.js

const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Product names should ideally be unique
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    imageUrl: { // URL to the product image
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: { // Average rating of the product
      type: Number,
      required: true,
      default: 0,
    },
    reviews: { // Number of reviews
      type: Number,
      required: true,
      default: 0,
    },
    // Optional: Reference to the admin user who created this product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Refers to the User model
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Product = mongoose.model('Product', productSchema); // Create the Product model

module.exports = Product; // Export the model
