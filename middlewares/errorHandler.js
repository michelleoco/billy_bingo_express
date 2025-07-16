// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  // If the error has a statusCode, use it; otherwise default to 500
  const statusCode = err.statusCode || 500;

  // If the error has a message, use it; otherwise provide a generic message
  const message = err.message || "Internal Server Error";

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
};

module.exports = errorHandler;
