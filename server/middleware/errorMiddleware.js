    // server/middleware/errorMiddleware.js

    // Middleware to handle 404 (Not Found) errors
    const notFound = (req, res, next) => {
      const error = new Error(`Not Found - ${req.originalUrl}`);
      res.status(404); // Set status to 404
      next(error); // Pass the error to the next middleware (our errorHandler)
    };

    // General error handling middleware
    const errorHandler = (err, req, res, next) => {
      // If status code is 200 (OK), but an error occurred, change it to 500 (Internal Server Error)
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      res.status(statusCode); // Set the response status code

      res.json({
        message: err.message, // Send the error message
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Send stack trace only in development
      });
    };

    module.exports = {
      notFound,
      errorHandler,
    };
    