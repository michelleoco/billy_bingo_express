const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
const {
  validateUserRegistration,
  validateUserUpdate,
} = require("../utils/validation");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      data: users,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const user = await User.findUserById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "User retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Create new user
const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate user data
    const validation = validateUserRegistration({ name, email, password });
    if (!validation.isValid) {
      throw new BadRequestError(validation.errors.join(", "));
    }

    // Create new user (the model handles duplicate email checking)
    const userData = { name, email, password };
    const newUser = await User.createUser(userData);

    res.status(201).json({
      success: true,
      data: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    // Validate update data
    const validation = validateUserUpdate(updateData);
    if (!validation.isValid) {
      throw new BadRequestError(validation.errors.join(", "));
    }

    const user = await User.findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Update user
    const updatedUser = await user.updateUser(updateData);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError("User ID is required");
    }

    const user = await User.findUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Register new user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate user data
    const validation = validateUserRegistration({ name, email, password });
    if (!validation.isValid) {
      throw new BadRequestError(validation.errors.join(", "));
    }

    // Create new user (the model handles duplicate email checking)
    const userData = { name, email, password };
    const newUser = await User.createUser(userData);

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Email and password are required");
    }

    // Find user by email and include password for verification
    const user = await User.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
      message: "Login successful",
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      throw new NotFoundError("User not found");
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "Current user retrieved successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  getCurrentUser,
};
