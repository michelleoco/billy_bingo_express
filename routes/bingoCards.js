const express = require("express");
const {
  createBingoCard,
  getUserBingoCards,
  getBingoCardById,
  updateBingoCard,
  deleteBingoCard,
  getBingoCardStats,
} = require("../controllers/bingoCardController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

// All routes require authentication
router.use(auth);

// POST /api/bingo-cards - Create a new bingo card
router.post("/", createBingoCard);

// GET /api/bingo-cards - Get all bingo cards for the authenticated user
router.get("/", getUserBingoCards);

// GET /api/bingo-cards/stats - Get bingo card statistics for the user
router.get("/stats", getBingoCardStats);

// GET /api/bingo-cards/:cardId - Get a specific bingo card by ID
router.get("/:cardId", getBingoCardById);

// PUT /api/bingo-cards/:cardId - Update a bingo card
router.put("/:cardId", updateBingoCard);

// DELETE /api/bingo-cards/:cardId - Delete a bingo card
router.delete("/:cardId", deleteBingoCard);

module.exports = router;
