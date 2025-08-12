/**
 * BMFSDB™ API Wrapper for Node.js
 * A JavaScript client library for interacting with the setlist.fm API
 * providing access to Billy Strings setlist data, artist information, venues, and more.
 */

const https = require("https");
const querystring = require("querystring");

class BmfsdbApi {
  constructor(options = {}) {
    this.key = options.key;
    this.format = options.format || "json";
    this.language = options.language || "en";
    this.baseUrl = "api.setlist.fm";
    this.basePath = "/rest/1.0";

    if (!this.key) {
      throw new Error("API key is required");
    }
  }

  /**
   * Make a request to the setlist.fm API
   * @param {string} endpoint - API endpoint
   * @param {object} params - Query parameters
   * @returns {Promise} - Promise resolving to API response
   */
  _makeRequest(endpoint, params = {}) {
    return new Promise((resolve, reject) => {
      // Don't add format and language to params as they might not be expected
      const queryString = querystring.stringify(params);
      const path = `${this.basePath}${endpoint}${
        queryString ? `?${queryString}` : ""
      }`;

      const options = {
        hostname: this.baseUrl,
        port: 443,
        path: path,
        method: "GET",
        headers: {
          Accept: "application/json",
          "x-api-key": this.key,
          "User-Agent": "BmfsdbApi/1.0.0",
        },
      };

      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              const parsedData =
                this.format === "json" ? JSON.parse(data) : data;
              resolve(parsedData);
            } else {
              reject(
                new Error(
                  `API request failed with status ${res.statusCode}: ${data}`
                )
              );
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on("error", (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.end();
    });
  }

  /**
   * Get setlists for a specific artist
   * @param {string} mbid - MusicBrainz ID of the artist
   * @param {object} options - Query options (p for page, etc.)
   * @returns {Promise} - Promise resolving to setlists
   */
  getArtistSetlists(mbid, options = {}) {
    return this._makeRequest(`/artist/${mbid}/setlists`, options);
  }

  /**
   * Get setlists for Billy Strings specifically
   * @param {object} options - Query options
   * @returns {Promise} - Promise resolving to Billy Strings setlists
   */
  getBillyStringsSetlists(options = {}) {
    const billyStringsMbid = "640db492-34c4-47df-be14-96e2cd4b9fe4";
    return this.getArtistSetlists(billyStringsMbid, options);
  }

  /**
   * Search for setlists
   * @param {object} params - Search parameters
   * @returns {Promise} - Promise resolving to search results
   */
  searchSetlists(params = {}) {
    return this._makeRequest("/search/setlists", params);
  }

  /**
   * Get a specific setlist by ID
   * @param {string} setlistId - Setlist ID
   * @returns {Promise} - Promise resolving to setlist details
   */
  getSetlist(setlistId) {
    return this._makeRequest(`/setlist/${setlistId}`);
  }

  /**
   * Search for artists
   * @param {object} params - Search parameters
   * @returns {Promise} - Promise resolving to artist search results
   */
  searchArtists(params = {}) {
    return this._makeRequest("/search/artists", params);
  }

  /**
   * Get artist information
   * @param {string} mbid - MusicBrainz ID of the artist
   * @returns {Promise} - Promise resolving to artist information
   */
  getArtist(mbid) {
    return this._makeRequest(`/artist/${mbid}`);
  }

  /**
   * Search for venues
   * @param {object} params - Search parameters
   * @returns {Promise} - Promise resolving to venue search results
   */
  searchVenues(params = {}) {
    return this._makeRequest("/search/venues", params);
  }

  /**
   * Get venue information
   * @param {string} venueId - Venue ID
   * @returns {Promise} - Promise resolving to venue information
   */
  getVenue(venueId) {
    return this._makeRequest(`/venue/${venueId}`);
  }

  /**
   * Get setlists for a specific venue
   * @param {string} venueId - Venue ID
   * @param {object} options - Query options
   * @returns {Promise} - Promise resolving to venue setlists
   */
  getVenueSetlists(venueId, options = {}) {
    return this._makeRequest(`/venue/${venueId}/setlists`, options);
  }
}

module.exports = BmfsdbApi;
