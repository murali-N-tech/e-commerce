// server/utils/generateToken.js

const jwt = require('jsonwebtoken'); // Import jsonwebtoken

// Function to generate a JWT
// Now accepts userId and userRole
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { // Include role in payload
    expiresIn: '30d', // Token expires in 30 days
  });
};

module.exports = generateToken; // Export the function
