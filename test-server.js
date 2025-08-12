const express = require("express");
const routes = require("./routes");

const app = express();
const { PORT = 3002 } = process.env;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use("/api", routes);

// Simple test route
app.get("/test", (req, res) => {
  res.json({ message: "Test server is working!" });
});

// Start server WITHOUT database connection
app.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/test`);
  console.log(`API endpoints: http://localhost:${PORT}/api`);
});
