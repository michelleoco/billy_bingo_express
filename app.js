const express = require("express");
const app = express();

// Environment variable for the port
// Default to 3000 if not set- to set it, use `PORT=4000 npm run dev`
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
