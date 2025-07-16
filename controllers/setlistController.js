const SetlistService = require("../services/setlistService");
const { ValidationError } = require("../utils/errors");

/**
 * Controller for handling setlist-related API endpoints
 */
class SetlistController {
  /**
   * Get Billy Strings setlists with pagination
   * GET /api/setlists/billy-strings
   * Query params: page (optional, default: 1)
   */
  static async getBillyStringsSetlists(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;

      if (page < 1) {
        throw new ValidationError("Page number must be greater than 0");
      }

      const result = await SetlistService.getBillyStringsSetlists(page);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch setlists",
          error: result.error,
        });
      }

      res.status(200).json({
        success: true,
        message: "Setlists retrieved successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a comprehensive list of Billy Strings songs
   * GET /api/setlists/billy-strings/songs
   * Query params: maxPages (optional, default: 5)
   */
  static async getBillyStringsSongs(req, res, next) {
    try {
      const maxPages = parseInt(req.query.maxPages) || 5;

      if (maxPages < 1 || maxPages > 20) {
        throw new ValidationError("maxPages must be between 1 and 20");
      }

      const result = await SetlistService.getBillyStringsSongs(maxPages);

      const statusCode = result.success ? 200 : 206; // 206 for partial content when using fallback

      res.status(statusCode).json({
        success: result.success,
        message: result.success
          ? "Songs retrieved successfully"
          : "Using fallback songs due to API error",
        data: result.data,
        error: result.error || null,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific setlist by ID
   * GET /api/setlists/:setlistId
   */
  static async getSetlistById(req, res, next) {
    try {
      const { setlistId } = req.params;

      if (!setlistId || setlistId.trim() === "") {
        throw new ValidationError("Setlist ID is required");
      }

      const result = await SetlistService.getSetlistById(setlistId.trim());

      if (!result.success) {
        return res.status(404).json({
          success: false,
          message: "Setlist not found",
          error: result.error,
        });
      }

      res.status(200).json({
        success: true,
        message: "Setlist retrieved successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search setlists with various parameters
   * GET /api/setlists/search
   * Query params: artistName, venueName, cityName, countryCode, date, year, etc.
   */
  static async searchSetlists(req, res, next) {
    try {
      const searchParams = {};

      // Extract and validate search parameters
      const allowedParams = [
        "artistName",
        "venueName",
        "cityName",
        "countryCode",
        "date",
        "year",
        "p", // page
      ];

      allowedParams.forEach((param) => {
        if (req.query[param]) {
          searchParams[param] = req.query[param].trim();
        }
      });

      // Validate that at least one search parameter is provided
      if (Object.keys(searchParams).length === 0) {
        throw new ValidationError("At least one search parameter is required");
      }

      // Validate page parameter
      if (searchParams.p) {
        const page = parseInt(searchParams.p);
        if (page < 1) {
          throw new ValidationError("Page number must be greater than 0");
        }
        searchParams.p = page;
      }

      const result = await SetlistService.searchSetlists(searchParams);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Search failed",
          error: result.error,
        });
      }

      res.status(200).json({
        success: true,
        message: "Search completed successfully",
        data: result.data,
        searchParams,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Billy Strings artist information
   * GET /api/setlists/billy-strings/artist-info
   */
  static async getBillyStringsArtistInfo(req, res, next) {
    try {
      const result = await SetlistService.getBillyStringsArtistInfo();

      if (!result.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch artist information",
          error: result.error,
        });
      }

      res.status(200).json({
        success: true,
        message: "Artist information retrieved successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get fallback songs (for testing or when API is down)
   * GET /api/setlists/fallback-songs
   */
  static async getFallbackSongs(req, res, next) {
    try {
      const songs = SetlistService.getFallbackSongs();

      res.status(200).json({
        success: true,
        message: "Fallback songs retrieved successfully",
        data: {
          songs,
          metadata: {
            totalSongs: songs.length,
            fallback: true,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Health check for setlist API integration
   * GET /api/setlists/health
   */
  static async healthCheck(req, res, next) {
    try {
      // Try to fetch a small amount of data to test API connectivity
      const result = await SetlistService.getBillyStringsSetlists(1);

      res.status(200).json({
        success: true,
        message: "Setlist API integration is healthy",
        apiStatus: result.success ? "connected" : "fallback",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(200).json({
        success: false,
        message: "Setlist API integration health check failed",
        apiStatus: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = SetlistController;
