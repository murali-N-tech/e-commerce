// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email addresses are unique
    },
    password: {
      type: String,
      required: true,
    },
    role: { // New field: user role (e.g., 'user', 'admin')
      type: String,
      required: true,
      default: 'user', // Default role is 'user'
      enum: ['user', 'admin'], // Only allowed values are 'user' or 'admin'
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Middleware to hash password before saving (pre-save hook)
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10); // 10 is a good default for salt rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema); // Create the User model

module.exports = User; // Export the model
