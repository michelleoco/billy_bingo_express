const mongoose = require("mongoose");
// const validator = require("validator"); ?????????
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't include password in queries by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // Remove password from JSON output
        return ret;
      },
    },
  }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Static method to find user by email (including password for authentication)
userSchema.statics.findByEmailWithPassword = function (email) {
  return this.findOne({ email }).select("+password");
};

// Static method to create a new user with validation
userSchema.statics.createUser = async function (userData) {
  try {
    // Check for existing email
    const existingEmail = await this.findOne({ email: userData.email });
    if (existingEmail) {
      const duplicateError = new Error("Email already exists");
      duplicateError.statusCode = 409;
      duplicateError.name = "ConflictError";
      throw duplicateError;
    }

    // Check for existing username
    const existingUsername = await this.findOne({ name: userData.name });
    if (existingUsername) {
      const duplicateError = new Error("Username already exists");
      duplicateError.statusCode = 409;
      duplicateError.name = "ConflictError";
      throw duplicateError;
    }

    const user = new this(userData);
    return await user.save();
  } catch (error) {
    // Handle mongoose duplicate key error as fallback
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const duplicateError = new Error(
        field === "email" ? "Email already exists" : "Username already exists"
      );
      duplicateError.statusCode = 409;
      duplicateError.name = "ConflictError";
      throw duplicateError;
    }
    throw error;
  }
};

// Static method to find user by ID
userSchema.statics.findUserById = function (id) {
  return this.findById(id);
};

// Instance method to update user data
userSchema.methods.updateUser = async function (updateData) {
  try {
    // Remove password from update data if present (should be updated separately)
    const { password, ...safeUpdateData } = updateData;

    Object.assign(this, safeUpdateData);
    return await this.save();
  } catch (error) {
    throw error;
  }
};

// Instance method to update password
userSchema.methods.updatePassword = async function (newPassword) {
  try {
    this.password = newPassword;
    return await this.save();
  } catch (error) {
    throw error;
  }
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
