# Billy BINGO: Back End

_A dynamic Express.js API powering the Billy Strings Concert BINGO fan experience._

---

## Live Project

**Domain:** [app.billybingo.moonangel.com](https://app.billybingo.moonangel.com/)  
**Front-End Repository:** [Billy Bingo Front-End](https://github.com/michelleoco/billy_bingo_react)

---

## Introduction

**Billy BINGO** is a fan-driven digital platform inspired by the improvisational live concerts of bluegrass musician Billy Strings. Since every concert features a unique setlist, fans (“Goats”) create personalized BINGO cards predicting which songs will be played.

This back-end repository contains the **Express.js API** that supports the app by managing user profiles, storing and updating BINGO card data, and generating song recommendations pulled from Billy Strings’ historical setlists using APIs such as setlist.fm and bmfsdb-js-api.

---

## Project Goals

- Develop a secure and scalable back-end API to power the Billy BINGO web app.
- Enable user authentication and authorization for personalized profiles.
- Manage CRUD operations for BINGO cards and song selections.
- Integrate with external APIs to fetch historical setlist data for song recommendations.
- Ensure robust input validation, error handling, and secure password management.

---

## What Was Done

The back end was built using **Node.js** and **Express.js** with a **MongoDB** database, and key implementations included:

1. **User Management**

   - Signup/signin with secure password hashing via **Bcrypt**.
   - JWT-based authentication and protected routes.

2. **BINGO Card Operations**

   - CRUD endpoints to create, read, update, and delete BINGO cards.
   - Support for manual song entry and “Random Select” from historical data.

3. **API Integration**

   - Connected to external APIs (setlist.fm and bmfsdb-js-api) to pull song data.
   - Provided song metadata such as last played date and total play count.

4. **Validation & Error Handling**

   - Input validation using **Celebrate/Joi**.
   - Centralized error handler for consistent API responses.

5. **Security & Code Quality**

   - Enforced code standards with **ESLint**.
   - Secure password storage and token validation.

---

## Features

- User authentication (signup/signin)
- CRUD operations for BINGO cards and song entries
- Historical song recommendations via external API integration
- Secure password handling and route protection
- Robust input validation and error management

---

## Technologies

- **Node.js** – Server-side JavaScript runtime
- **Express.js** – Handles routing and API endpoints
- **MongoDB** – Stores application data
- **Mongoose** – Models and queries MongoDB data
- **JSON Web Tokens (JWT)** – Manages user authentication
- **Bcrypt** – Hashes and secures passwords
- **CORS** – Enables cross-origin requests
- **ESLint** – Enforces consistent code style

---

## Example API Responses

### POST /api/users/register (User Registration)

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "64f8a3c5b3e1d2a5c1234567",
      "name": "GoatFan123",
      "email": "fan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  },
  "message": "User registered successfully"
}
```

### GET /api/setlists/billy-strings/songs (Retrieve Songs)

```json
{
  "success": true,
  "message": "Songs retrieved successfully",
  "data": {
    "songs": [...],
    "metadata": {...}
  }
}
```

### POST /api/bingo-cards (Create a BINGO Card)

```json
{
  "success": true,
  "message": "Bingo card created successfully",
  "data": {
    "_id": "66a1d8b2f1b9a7c3d5e9",
    "name": "Card Name",
    "squares": [...],
    "userId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Conclusion

The Billy BINGO back end provides a robust foundation for a unique, interactive concert experience by securely managing users and integrating historical song data.

---

## Future Improvements

- **Game Features:** Implement real-time marking of played songs and automatic BINGO detection/notifications.
- **User Archive:** Allow fans to save and revisit past BINGO cards as digital memorabilia.
- **Social Sharing:** Enable users to compare cards and share BINGO wins with friends.
- **Mobile Optimization:** Enhance API support for mobile-first front-end features.
- **Fix:** Improve API response caching **to achieve** faster performance during live concerts.

---

## Deployment & Requirements

**Requirements:**

- Node.js ≥ 18
- MongoDB ≥ 5.0
- npm ≥ 9.0

**Installation:**

```bash
git clone https://github.com/michelleoco/billy_bingo_express.git
cd billy_bingo_express
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=mongodb://localhost:27017/billy_bingo

# JWT Secret (generate a secure random string)
JWT_SECRET=your_jwt_secret_here

# Server Port (optional, defaults to 3001)
PORT=3001
```
