const mongoose = require("mongoose");

const bingoCardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Card name is required"],
      trim: true,
      minlength: [1, "Card name must be at least 1 character long"],
      maxlength: [100, "Card name cannot exceed 100 characters"],
    },
    date: {
      type: String,
      trim: true,
      maxlength: [50, "Date cannot exceed 50 characters"],
    },
    venue: {
      type: String,
      trim: true,
      maxlength: [200, "Venue cannot exceed 200 characters"],
    },
    squares: {
      type: [String],
      required: [true, "Bingo squares are required"],
      validate: {
        validator: function (squares) {
          return squares.length === 25;
        },
        message: "Bingo card must have exactly 25 squares",
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // Convert _id to id for frontend consistency
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Index for efficient querying by user
bingoCardSchema.index({ userId: 1, createdAt: -1 });

// Static method to create a new bingo card
bingoCardSchema.statics.createCard = async function (cardData) {
  try {
    const card = new this(cardData);
    return await card.save();
  } catch (error) {
    throw error;
  }
};

// Static method to find cards by user ID
bingoCardSchema.statics.findCardsByUserId = function (userId, options = {}) {
  const { limit = 50, skip = 0, sort = { createdAt: -1 } } = options;

  return this.find({ userId })
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .populate("userId", "name email");
};

// Static method to find a specific card by ID and user ID
bingoCardSchema.statics.findCardByIdAndUserId = function (cardId, userId) {
  return this.findOne({ _id: cardId, userId }).populate("userId", "name email");
};

// Instance method to update card data
bingoCardSchema.methods.updateCard = async function (updateData) {
  try {
    // Only allow updating specific fields
    const allowedUpdates = ["name", "date", "venue", "squares"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    Object.assign(this, updates);
    return await this.save();
  } catch (error) {
    throw error;
  }
};

// Instance method to delete card (soft delete could be implemented here if needed)
bingoCardSchema.methods.deleteCard = async function () {
  try {
    return await this.deleteOne();
  } catch (error) {
    throw error;
  }
};

// Virtual for card summary
bingoCardSchema.virtual("summary").get(function () {
  const filledSquares = this.squares.filter(
    (square) => square && square.trim() !== ""
  ).length;
  return {
    filledSquares,
    totalSquares: 25,
    progress: `${filledSquares}/25`,
    isComplete: filledSquares === 25,
  };
});

// Create and export the BingoCard model
const BingoCard = mongoose.model("BingoCard", bingoCardSchema);

module.exports = BingoCard;
