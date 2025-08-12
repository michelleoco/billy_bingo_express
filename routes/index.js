const express = require("express");
const userRoutes = require("./users");
const setlistRoutes = require("./setlists");
const bingoCardRoutes = require("./bingoCards");

const router = express.Router();

// Health check route
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Billy Bingo API is running!",
    timestamp: new Date().toISOString(),
  });
});

// User routes
router.use("/users", userRoutes);

// Setlist routes
router.use("/setlists", setlistRoutes);

// Bingo card routes
router.use("/bingo-cards", bingoCardRoutes);

module.exports = router;
