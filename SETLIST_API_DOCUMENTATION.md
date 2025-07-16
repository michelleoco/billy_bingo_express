# Billy Bingo Setlist API Documentation

This document describes the setlist.fm API integration endpoints available in the Billy Bingo backend.

## Base URL

```
http://localhost:3001/api/setlists
```

## Authentication

No authentication is required for these endpoints. The API key for setlist.fm is handled server-side.

## Endpoints

### 1. Health Check

**GET** `/health`

Check the health and connectivity of the setlist API integration.

**Response:**

```json
{
  "success": true,
  "message": "Setlist API integration is healthy",
  "apiStatus": "connected", // or "fallback" or "error"
  "timestamp": "2025-01-13T21:30:00.000Z"
}
```

### 2. Get Billy Strings Setlists

**GET** `/billy-strings`

Fetch Billy Strings setlists with pagination.

**Query Parameters:**

- `page` (optional): Page number (default: 1)

**Example Request:**

```
GET /api/setlists/billy-strings?page=1
```

**Response:**

```json
{
  "success": true,
  "message": "Setlists retrieved successfully",
  "data": {
    "setlist": [
      {
        "id": "setlist-id",
        "eventDate": "13-01-2025",
        "artist": {
          "mbid": "640db492-34b4-47a3-8a0a-5b38ede3c328",
          "name": "Billy Strings"
        },
        "venue": {
          "id": "venue-id",
          "name": "Venue Name",
          "city": {
            "name": "City Name",
            "state": "State",
            "country": {
              "code": "US",
              "name": "United States"
            }
          }
        },
        "sets": {
          "set": [
            {
              "song": [
                {
                  "name": "Dust in a Baggie"
                },
                {
                  "name": "Away From the Mire"
                }
              ]
            }
          ]
        }
      }
    ],
    "total": 100,
    "page": 1,
    "itemsPerPage": 20
  },
  "pagination": {
    "page": 1,
    "total": 100,
    "itemsPerPage": 20
  }
}
```

### 3. Get Billy Strings Songs

**GET** `/billy-strings/songs`

Fetch a comprehensive list of Billy Strings songs from multiple setlist pages.

**Query Parameters:**

- `maxPages` (optional): Maximum number of pages to fetch (default: 5, max: 20)

**Example Request:**

```
GET /api/setlists/billy-strings/songs?maxPages=3
```

**Response:**

```json
{
  "success": true,
  "message": "Songs retrieved successfully",
  "data": {
    "songs": [
      "All of Tomorrow",
      "Away From the Mire",
      "Black Clouds",
      "Bronzeback",
      "Dealing Despair",
      "Dust in a Baggie"
    ],
    "metadata": {
      "totalSetlists": 45,
      "totalSongs": 120,
      "pagesFetched": 3,
      "totalPagesAvailable": 15,
      "fallback": false
    }
  }
}
```

**Fallback Response (when API fails):**

```json
{
  "success": false,
  "message": "Using fallback songs due to API error",
  "data": {
    "songs": ["Dust in a Baggie", "Away From the Mire", ...],
    "metadata": {
      "totalSetlists": 0,
      "totalSongs": 44,
      "pagesFetched": 0,
      "totalPagesAvailable": 0,
      "fallback": true
    }
  },
  "error": "API error message"
}
```

### 4. Get Billy Strings Artist Info

**GET** `/billy-strings/artist-info`

Fetch Billy Strings artist information from setlist.fm.

**Response:**

```json
{
  "success": true,
  "message": "Artist information retrieved successfully",
  "data": {
    "mbid": "640db492-34b4-47a3-8a0a-5b38ede3c328",
    "name": "Billy Strings",
    "sortName": "Billy Strings",
    "disambiguation": "",
    "url": "https://www.setlist.fm/setlists/billy-strings-..."
  }
}
```

### 5. Get Specific Setlist

**GET** `/:setlistId`

Fetch a specific setlist by its ID.

**Path Parameters:**

- `setlistId`: The setlist ID from setlist.fm

**Example Request:**

```
GET /api/setlists/63d4f8e1
```

**Response:**

```json
{
  "success": true,
  "message": "Setlist retrieved successfully",
  "data": {
    "id": "63d4f8e1",
    "eventDate": "13-01-2025",
    "artist": {
      "mbid": "640db492-34b4-47a3-8a0a-5b38ede3c328",
      "name": "Billy Strings"
    },
    "venue": {
      "name": "Red Rocks Amphitheatre",
      "city": {
        "name": "Morrison",
        "state": "Colorado",
        "country": {
          "code": "US",
          "name": "United States"
        }
      }
    },
    "sets": {
      "set": [
        {
          "song": [
            { "name": "Dust in a Baggie" },
            { "name": "Away From the Mire" }
          ]
        }
      ]
    }
  }
}
```

### 6. Search Setlists

**GET** `/search`

Search for setlists with various parameters.

**Query Parameters:**

- `artistName` (optional): Artist name to search for
- `venueName` (optional): Venue name to search for
- `cityName` (optional): City name to search for
- `countryCode` (optional): Country code (e.g., "US")
- `date` (optional): Date in format "dd-MM-yyyy"
- `year` (optional): Year (e.g., "2025")
- `p` (optional): Page number (default: 1)

**Example Request:**

```
GET /api/setlists/search?artistName=Billy%20Strings&cityName=Denver&year=2025
```

**Response:**

```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "setlist": [
      // Array of setlist objects matching search criteria
    ],
    "total": 25,
    "page": 1,
    "itemsPerPage": 20
  },
  "searchParams": {
    "artistName": "Billy Strings",
    "cityName": "Denver",
    "year": "2025"
  }
}
```

### 7. Get Fallback Songs

**GET** `/fallback-songs`

Get the hardcoded fallback list of Billy Strings songs (for testing or when API is down).

**Response:**

```json
{
  "success": true,
  "message": "Fallback songs retrieved successfully",
  "data": {
    "songs": [
      "All of Tomorrow",
      "Away From the Mire",
      "Black Clouds",
      "Bronzeback"
    ],
    "metadata": {
      "totalSongs": 44,
      "fallback": true
    }
  }
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-01-13T21:30:00.000Z"
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `206`: Partial Content (when using fallback data)
- `400`: Bad Request (validation errors)
- `404`: Not Found (setlist not found)
- `500`: Internal Server Error (API or server errors)

## Rate Limiting

The setlist.fm API has rate limits. The backend includes small delays between requests to be respectful to their API. If you encounter rate limiting issues, consider:

1. Reducing the `maxPages` parameter for song fetching
2. Implementing caching on the frontend
3. Using the fallback songs when appropriate

## Integration Notes

1. **CORS**: The backend handles CORS issues that would occur when calling setlist.fm directly from the frontend.

2. **API Key**: The setlist.fm API key is securely stored on the backend and not exposed to the frontend.

3. **Fallback Mechanism**: When the setlist.fm API is unavailable, the system automatically falls back to a curated list of Billy Strings songs.

4. **Error Handling**: All endpoints include comprehensive error handling and will return meaningful error messages.

5. **Data Processing**: The backend processes and normalizes the setlist.fm API responses for easier consumption by the frontend.

## Frontend Integration

The React frontend should use these endpoints instead of calling setlist.fm directly. Example usage:

```javascript
// Fetch songs for bingo card
const songs = await fetchBillyStringsSongs(5);

// Fetch recent setlists
const setlists = await fetchBillyStringsSetlists(1);
```

The frontend `setlistApi.js` utility has been updated to use these backend endpoints.
