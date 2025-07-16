const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

// POST /users/register - Register new user
router.post("/register", registerUser);

// POST /users/login - Login user
router.post("/login", loginUser);

// GET /users/me - Get current user (protected)
router.get("/me", auth, getCurrentUser);

// PUT /users/me - Update current user (protected)
router.put("/me", auth, updateUser);

// GET /users - Get all users
router.get("/", getUsers);

// GET /users/:id - Get user by ID
router.get("/:id", getUserById);

// POST /users - Create new user
router.post("/", createUser);

// PUT /users/:id - Update user
router.put("/:id", updateUser);

// DELETE /users/:id - Delete user
router.delete("/:id", deleteUser);

module.exports = router;
