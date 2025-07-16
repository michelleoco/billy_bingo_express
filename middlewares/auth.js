const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { UnauthorizedError } = require("../utils/errors");

// JWT secret key (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    // Check if token starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Access denied. Invalid token format.");
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      throw new UnauthorizedError("Access denied. No token provided.");
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new UnauthorizedError("Access denied. User not found.");
    }

    // Add user to request object
    req.user = {
      id: user._id.toString(),
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new UnauthorizedError("Access denied. Invalid token."));
    } else if (error.name === "TokenExpiredError") {
      next(new UnauthorizedError("Access denied. Token expired."));
    } else {
      next(error);
    }
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId: userId }, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

// Verify JWT token (utility function)
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new UnauthorizedError("Invalid token");
  }
};

module.exports = {
  auth,
  generateToken,
  verifyToken,
  JWT_SECRET,
};
