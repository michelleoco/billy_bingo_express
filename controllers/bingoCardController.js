const BingoCard = require("../models/BingoCard");
const {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");
const { validateBingoCard, validateObjectId } = require("../utils/validation");

// Create a new bingo card
const createBingoCard = async (req, res, next) => {
  try {
    console.log("Backend: Received bingo card creation request");
    console.log("Backend: Request body:", req.body);
    console.log("Backend: User ID from token:", req.user?.id);

    const { name, date, venue, squares } = req.body;
    const userId = req.user.id;

    console.log("Backend: Extracted data:", {
      name,
      date,
      venue,
      squares,
      userId,
    });

    // Validate the bingo card data
    const validationError = validateBingoCard({ name, date, venue, squares });
    if (validationError) {
      console.error("Backend: Validation error:", validationError);
      throw new ValidationError(validationError);
    }

    console.log("Backend: Validation passed");

    // Create the bingo card
    const cardData = {
      name,
      date: date || "",
      venue: venue || "",
      squares,
      userId,
    };

    console.log("Backend: Creating card with data:", cardData);

    const newCard = await BingoCard.createCard(cardData);

    console.log("Backend: Card created successfully:", newCard);

    res.status(201).json({
      success: true,
      message: "Bingo card created successfully",
      data: newCard,
    });
  } catch (error) {
    console.error("Backend: Error in createBingoCard:", error);
    next(error);
  }
};

// Get all bingo cards for the authenticated user
const getUserBingoCards = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 50, skip = 0, sort = "createdAt" } = req.query;

    // Parse query parameters
    const options = {
      limit: parseInt(limit, 10),
      skip: parseInt(skip, 10),
      sort: sort === "createdAt" ? { createdAt: -1 } : { [sort]: -1 },
    };

    const cards = await BingoCard.findCardsByUserId(userId, options);

    res.status(200).json({
      success: true,
      message: "Bingo cards retrieved successfully",
      data: cards,
      count: cards.length,
    });
  } catch (error) {
    next(error);
  }
};

// Get a specific bingo card by ID
const getBingoCardById = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;

    // Validate the card ID
    if (!validateObjectId(cardId)) {
      throw new ValidationError("Invalid card ID format");
    }

    const card = await BingoCard.findCardByIdAndUserId(cardId, userId);

    if (!card) {
      throw new NotFoundError("Bingo card not found");
    }

    res.status(200).json({
      success: true,
      message: "Bingo card retrieved successfully",
      data: card,
    });
  } catch (error) {
    next(error);
  }
};

// Update a bingo card
const updateBingoCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { name, date, venue, squares } = req.body;
    const userId = req.user.id;

    // Validate the card ID
    if (!validateObjectId(cardId)) {
      throw new ValidationError("Invalid card ID format");
    }

    // Find the card
    const card = await BingoCard.findCardByIdAndUserId(cardId, userId);

    if (!card) {
      throw new NotFoundError("Bingo card not found");
    }

    // Validate the update data
    const updateData = { name, date, venue, squares };
    const validationError = validateBingoCard(updateData, false); // false = partial validation
    if (validationError) {
      throw new ValidationError(validationError);
    }

    // Update the card
    const updatedCard = await card.updateCard(updateData);

    res.status(200).json({
      success: true,
      message: "Bingo card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a bingo card
const deleteBingoCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const userId = req.user.id;

    // Validate the card ID
    if (!validateObjectId(cardId)) {
      throw new ValidationError("Invalid card ID format");
    }

    // Find the card
    const card = await BingoCard.findCardByIdAndUserId(cardId, userId);

    if (!card) {
      throw new NotFoundError("Bingo card not found");
    }

    // Delete the card
    await card.deleteCard();

    res.status(200).json({
      success: true,
      message: "Bingo card deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get bingo card statistics for the user
const getBingoCardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cards = await BingoCard.findCardsByUserId(userId);

    const stats = {
      totalCards: cards.length,
      completedCards: cards.filter((card) => card.summary.isComplete).length,
      averageProgress:
        cards.length > 0
          ? Math.round(
              cards.reduce((sum, card) => sum + card.summary.filledSquares, 0) /
                cards.length
            )
          : 0,
      recentCards: cards.slice(0, 5), // Last 5 cards
    };

    res.status(200).json({
      success: true,
      message: "Bingo card statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBingoCard,
  getUserBingoCards,
  getBingoCardById,
  updateBingoCard,
  deleteBingoCard,
  getBingoCardStats,
};
