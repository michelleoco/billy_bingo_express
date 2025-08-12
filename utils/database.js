// Database configuration and connection using Mongoose
const mongoose = require("mongoose");

const DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost:27017/billy_bingo";

// Database connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(DATABASE_URL);

    console.log("✅ Connected to MongoDB successfully");
    console.log(`📍 Database URL: ${DATABASE_URL}`);

    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️  MongoDB disconnected");
    });

    return true;
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

// Database disconnection function
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    return true;
  } catch (error) {
    console.error("❌ Database disconnection error:", error);
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  DATABASE_URL,
};
