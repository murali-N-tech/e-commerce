    // server/config/db.js

    const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
    require('dotenv').config(); // Load environment variables from .env file

    // Function to connect to the MongoDB database
    const connectDB = async () => {
      try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,      // Recommended for stable connections (though sometimes optional in newer Mongoose)
          useUnifiedTopology: true,   // Recommended for stable connections
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`); // Log successful connection
      } catch (error) {
        console.error(`Error: ${error.message}`); // Log connection errors
        process.exit(1); // Exit the process with a failure code
      }
    };

    module.exports = connectDB; // Export the connectDB function
    