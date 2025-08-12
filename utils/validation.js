// Validation utility functions
const mongoose = require("mongoose");

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (at least 8 characters, contains letter and number)
const isValidPassword = (password) => {
  if (password.length < 8) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  return hasLetter && hasNumber;
};

// Name validation (at least 2 characters, only letters and numbers)
const isValidName = (name) => {
  if (name.length < 2) return false;
  const nameRegex = /^[a-zA-Z0-9]+$/;
  return nameRegex.test(name);
};

// Generic required field validation
const isRequired = (value) => {
  return (
    value !== null && value !== undefined && value.toString().trim() !== ""
  );
};

// Validate user registration data
const validateUserRegistration = (userData) => {
  const errors = [];

  if (!isRequired(userData.name)) {
    errors.push("Name is required");
  } else if (!isValidName(userData.name)) {
    errors.push(
      "Name must be at least 2 characters and contain only letters and numbers"
    );
  }

  if (!isRequired(userData.email)) {
    errors.push("Email is required");
  } else if (!isValidEmail(userData.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!isRequired(userData.password)) {
    errors.push("Password is required");
  } else if (!isValidPassword(userData.password)) {
    errors.push(
      "Password must be at least 8 characters and contain both letters and numbers"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate user update data
const validateUserUpdate = (userData) => {
  const errors = [];

  if (userData.name !== undefined && !isValidName(userData.name)) {
    errors.push(
      "Name must be at least 2 characters and contain only letters and numbers"
    );
  }

  if (userData.email !== undefined && !isValidEmail(userData.email)) {
    errors.push("Please provide a valid email address");
  }

  if (userData.password !== undefined && !isValidPassword(userData.password)) {
    errors.push(
      "Password must be at least 8 characters and contain both letters and numbers"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Validate bingo card name
const isValidCardName = (name) => {
  if (!name || typeof name !== "string") return false;
  const trimmedName = name.trim();
  return trimmedName.length >= 1 && trimmedName.length <= 100;
};

// Validate bingo card squares
const isValidSquares = (squares) => {
  if (!Array.isArray(squares)) return false;
  if (squares.length !== 25) return false;

  // Check that all squares are strings and not too long
  return squares.every(
    (square) => typeof square === "string" && square.length <= 200
  );
};

// Validate bingo card data
const validateBingoCard = (cardData, isFullValidation = true) => {
  const errors = [];

  // Name validation (required for full validation)
  if (isFullValidation) {
    if (!isRequired(cardData.name)) {
      errors.push("Card name is required");
    } else if (!isValidCardName(cardData.name)) {
      errors.push("Card name must be between 1 and 100 characters");
    }
  } else if (cardData.name !== undefined && !isValidCardName(cardData.name)) {
    errors.push("Card name must be between 1 and 100 characters");
  }

  // Date validation (optional)
  if (cardData.date !== undefined && cardData.date !== null) {
    if (typeof cardData.date !== "string" || cardData.date.length > 50) {
      errors.push("Date must be a string with maximum 50 characters");
    }
  }

  // Venue validation (optional)
  if (cardData.venue !== undefined && cardData.venue !== null) {
    if (typeof cardData.venue !== "string" || cardData.venue.length > 200) {
      errors.push("Venue must be a string with maximum 200 characters");
    }
  }

  // Squares validation (required for full validation)
  if (isFullValidation) {
    if (!cardData.squares) {
      errors.push("Bingo squares are required");
    } else if (!isValidSquares(cardData.squares)) {
      errors.push(
        "Bingo card must have exactly 25 squares, each being a string with maximum 200 characters"
      );
    }
  } else if (
    cardData.squares !== undefined &&
    !isValidSquares(cardData.squares)
  ) {
    errors.push(
      "Bingo card must have exactly 25 squares, each being a string with maximum 200 characters"
    );
  }

  return errors.length > 0 ? errors.join(", ") : null;
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidName,
  isRequired,
  validateUserRegistration,
  validateUserUpdate,
  validateObjectId,
  isValidCardName,
  isValidSquares,
  validateBingoCard,
};
