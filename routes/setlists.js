const express = require("express");
const SetlistController = require("../controllers/setlistController");

const router = express.Router();

/**
 * Setlist API Routes
 * Base path: /api/setlists
 */

// Health check endpoint
router.get("/health", SetlistController.healthCheck);

// Billy Strings specific routes
router.get("/billy-strings", SetlistController.getBillyStringsSetlists);
router.get("/billy-strings/songs", SetlistController.getBillyStringsSongs);
router.get(
  "/billy-strings/artist-info",
  SetlistController.getBillyStringsArtistInfo
);

// General setlist routes
router.get("/search", SetlistController.searchSetlists);
router.get("/fallback-songs", SetlistController.getFallbackSongs);

// Specific setlist by ID (should be last to avoid conflicts)
router.get("/:setlistId", SetlistController.getSetlistById);

module.exports = router;
