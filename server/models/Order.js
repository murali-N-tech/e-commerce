// server/models/Order.js

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: { // Reference to the user who placed the order
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Links to the User model
    },
    orderItems: [ // Array of items in the order
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: { // Reference to the actual product from the Product model
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product', // Links to the Product model
        },
      },
    ],
    shippingAddress: { // Details for shipping
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentResult: { // Details from payment gateway (e.g., PayPal, Stripe)
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

const Order = mongoose.model('Order', orderSchema); // Create the Order model

module.exports = Order; // Export the model
