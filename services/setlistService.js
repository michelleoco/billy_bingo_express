const BmfsdbApi = require("../libs/bmfsdb");

// Initialize the API client with your key
const client = new BmfsdbApi({
  key: "xFlMsjxDcP4OYfNMyv289wB8buzdOTbh6cNY",
  format: "json",
  language: "en",
});

/**
 * Service class for handling setlist.fm API operations
 */
class SetlistService {
  /**
   * Get Billy Strings setlists with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (API default is 20)
   * @returns {Promise<Object>} - Setlist data with pagination info
   */
  static async getBillyStringsSetlists(page = 1, limit = 20) {
    try {
      const response = await client.getBillyStringsSetlists({ p: page });
      return {
        success: true,
        data: response,
        pagination: {
          page: parseInt(page),
          total: response.total || 0,
          itemsPerPage: response.itemsPerPage || limit,
        },
      };
    } catch (error) {
      console.error("Error fetching Billy Strings setlists:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Extract unique songs from setlists
   * @param {Array} setlists - Array of setlist objects
   * @returns {Array<string>} - Array of unique song names
   */
  static extractSongsFromSetlists(setlists) {
    const songs = new Set();

    if (!Array.isArray(setlists)) {
      return [];
    }

    setlists.forEach((setlist) => {
      if (setlist.sets && setlist.sets.set) {
        setlist.sets.set.forEach((set) => {
          if (set.song && Array.isArray(set.song)) {
            set.song.forEach((song) => {
              if (song.name && song.name.trim()) {
                songs.add(song.name.trim());
              }
            });
          }
        });
      }
    });

    return Array.from(songs).sort();
  }

  /**
   * Get a comprehensive list of Billy Strings songs from multiple setlist pages
   * @param {number} maxPages - Maximum number of pages to fetch (default: 5)
   * @returns {Promise<Object>} - Object containing songs array and metadata
   */
  static async getBillyStringsSongs(maxPages = 5) {
    try {
      const allSetlists = [];
      let currentPage = 1;
      let totalPages = 1;

      // Fetch first page to get total pages info
      const firstPageResponse = await this.getBillyStringsSetlists(1);

      if (!firstPageResponse.success) {
        throw new Error(firstPageResponse.error);
      }

      const firstPageData = firstPageResponse.data;
      if (firstPageData.setlist && Array.isArray(firstPageData.setlist)) {
        allSetlists.push(...firstPageData.setlist);
      }

      // Calculate total pages based on API response
      if (firstPageData.total && firstPageData.itemsPerPage) {
        totalPages = Math.ceil(
          firstPageData.total / firstPageData.itemsPerPage
        );
      }

      // Fetch additional pages up to maxPages or totalPages, whichever is smaller
      const pagesToFetch = Math.min(maxPages, totalPages);

      for (currentPage = 2; currentPage <= pagesToFetch; currentPage++) {
        const pageResponse = await this.getBillyStringsSetlists(currentPage);

        if (pageResponse.success && pageResponse.data.setlist) {
          allSetlists.push(...pageResponse.data.setlist);
        } else {
          console.warn(
            `Failed to fetch page ${currentPage}:`,
            pageResponse.error
          );
        }

        // Add a small delay to be respectful to the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Extract unique songs from all setlists
      const songs = this.extractSongsFromSetlists(allSetlists);

      return {
        success: true,
        data: {
          songs,
          metadata: {
            totalSetlists: allSetlists.length,
            totalSongs: songs.length,
            pagesFetched: Math.min(currentPage - 1, pagesToFetch),
            totalPagesAvailable: totalPages,
          },
        },
      };
    } catch (error) {
      console.error("Error fetching Billy Strings songs:", error);

      // Return fallback songs if API fails
      return {
        success: false,
        error: error.message,
        data: {
          songs: this.getFallbackSongs(),
          metadata: {
            totalSetlists: 0,
            totalSongs: this.getFallbackSongs().length,
            pagesFetched: 0,
            totalPagesAvailable: 0,
            fallback: true,
          },
        },
      };
    }
  }

  /**
   * Get a specific setlist by ID
   * @param {string} setlistId - The setlist ID
   * @returns {Promise<Object>} - Setlist details
   */
  static async getSetlistById(setlistId) {
    try {
      const response = await client.getSetlist(setlistId);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error(`Error fetching setlist ${setlistId}:`, error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Search for setlists with various parameters
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Object>} - Search results
   */
  static async searchSetlists(searchParams) {
    try {
      const response = await client.searchSetlists(searchParams);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error searching setlists:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Get Billy Strings artist information
   * @returns {Promise<Object>} - Artist information
   */
  static async getBillyStringsArtistInfo() {
    try {
      const billyStringsMbid = "640db492-34c4-47df-be14-96e2cd4b9fe4";
      const response = await client.getArtist(billyStringsMbid);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error fetching Billy Strings artist info:", error);
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  }

  /**
   * Fallback songs list in case API is unavailable
   * @returns {Array<string>} - Array of fallback song names
   */
  static getFallbackSongs() {
    return [
      "Dust in a Baggie",
      "Away From the Mire",
      "Hide and Seek",
      "Turmoil & Tinfoil",
      "In the Morning Light",
      "Red Daisy",
      "Pyramid Country",
      "Secrets",
      "Love and Regret",
      "Heartbeat of America",
      "Know It All",
      "Wargasm",
      "Wharf Rat",
      "Thunder",
      "Likes of Me",
      "Hollow Heart",
      "Doin' Things Right",
      "Thirst Mutilator",
      "Dealing Despair",
      "Highway Hypnosis",
      "Must Be Seven",
      "Taking Water",
      "Fire Line",
      "Hellbender",
      "Enough to Leave",
      "Running the Route",
      "This Old World",
      "Bronzeback",
      "All of Tomorrow",
      "Unwanted Love",
      "Slow Train",
      "Tipper",
      "Fireline",
      "Meet Me at the Creek",
      "Rank Stranger",
      "Lonesome LA Cowboy",
      "Black Clouds",
      "While I'm Waiting Here",
      "Spinning",
      "Running",
      "Dos Banjos",
      "Streamline Cannonball",
      "Ernest T. Grass",
    ].sort();
  }
}

module.exports = SetlistService;
