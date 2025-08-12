const cors = require("cors");

const express = require("express");
const { connectDB } = require("./utils/database");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Environment variable for the port
// Default to 3001 if not set- to set it, use `PORT=4000 npm run dev`
const { PORT = 3001 } = process.env;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(cors()); // Enable CORS for all routes

// // CORS middleware (basic implementation)
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );

//   if (req.method === "OPTIONS") {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

// Routes
app.use("/api", routes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database connection and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
