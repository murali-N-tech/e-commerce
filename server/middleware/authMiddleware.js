// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for Authorization header and Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object, excluding password
      // IMPORTANT: Now also attach the `role` from the decoded token
      req.user = await User.findById(decoded.id).select('-password');
      if (req.user) {
        req.user.role = decoded.role; // Ensure the role from token is assigned
      } else {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next middleware
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
