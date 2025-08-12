# Billy Bingo Express API Documentation

## Overview

This is the backend API for the Billy Bingo application built with Express.js. The API provides endpoints for user management and will be extended for bingo game functionality.

## Project Structure

```
billy_bingo_express/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── controllers/           # Business logic for handling requests
│   └── userController.js  # User-related operations
├── middlewares/           # Custom middleware functions
│   └── errorHandler.js    # Central error handling
├── models/                # Data models and schemas
│   └── User.js           # User model (placeholder structure)
├── routes/                # API route definitions
│   ├── index.js          # Main router
│   └── users.js          # User routes
└── utils/                 # Utility functions
    ├── database.js        # Database connection setup
    ├── errors.js          # Custom error classes
    └── validation.js      # Input validation functions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:

   ```bash
   cd billy_bingo_express
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on port 3001 by default. You can change this by setting the PORT environment variable:

```bash
PORT=4000 npm run dev
```

## API Endpoints

### Base URL

```
http://localhost:3001/api
```

### Health Check

- **GET** `/` - Check if the API is running
  - Response: `200 OK`
  ```json
  {
    "success": true,
    "message": "Billy Bingo API is running!",
    "timestamp": "2025-01-11T22:55:00.000Z"
  }
  ```

### User Endpoints

#### Get All Users

- **GET** `/users`
- Response: `200 OK`

```json
{
  "success": true,
  "data": [],
  "message": "Users retrieved successfully"
}
```

#### Get User by ID

- **GET** `/users/:id`
- Parameters:
  - `id` (string) - User ID
- Response: `200 OK` | `404 Not Found`

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-11T22:55:00.000Z",
    "updatedAt": "2025-01-11T22:55:00.000Z"
  },
  "message": "User retrieved successfully"
}
```

#### Create User

- **POST** `/users`
- Request Body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

- Response: `201 Created` | `400 Bad Request` | `409 Conflict`

```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-01-11T22:55:00.000Z",
    "updatedAt": "2025-01-11T22:55:00.000Z"
  },
  "message": "User created successfully"
}
```

#### Update User

- **PUT** `/users/:id`
- Parameters:
  - `id` (string) - User ID
- Request Body (all fields optional):

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123"
}
```

- Response: `200 OK` | `400 Bad Request` | `404 Not Found`

#### Delete User

- **DELETE** `/users/:id`
- Parameters:
  - `id` (string) - User ID
- Response: `200 OK` | `404 Not Found`

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Validation Rules

### User Registration

- **Name**: Required, minimum 2 characters, letters and spaces only
- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters, must contain letters and numbers

### User Update

- **Name**: Optional, minimum 2 characters, letters and spaces only
- **Email**: Optional, valid email format
- **Password**: Optional, minimum 8 characters, must contain letters and numbers

## Error Handling

The API uses consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Error Status Codes

- `400` - Bad Request (validation errors, missing required fields)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

## Database Setup

Currently, the API uses placeholder models. To connect to a real database:

1. **For MongoDB with Mongoose:**

   ```bash
   npm install mongoose
   ```

   Update `utils/database.js` to uncomment the MongoDB connection code.

2. **For PostgreSQL with Sequelize:**

   ```bash
   npm install sequelize pg pg-hstore
   ```

   Replace the database connection code with Sequelize setup.

3. **Set Environment Variables:**
   ```bash
   export DATABASE_URL="your_database_connection_string"
   ```

## CORS Configuration

The API includes basic CORS middleware that allows all origins. For production, update the CORS configuration in `app.js` to restrict origins:

```javascript
res.header("Access-Control-Allow-Origin", "https://yourdomain.com");
```

## Development Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Testing the API

You can test the API endpoints using curl, Postman, or any HTTP client:

### Test Health Check

```bash
curl http://localhost:3001/api
```

### Test Get Users

```bash
curl http://localhost:3001/api/users
```

### Test Create User

```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Next Steps

1. **Database Integration**: Connect to your preferred database (MongoDB, PostgreSQL, etc.)
2. **Authentication**: Add JWT-based authentication middleware
3. **Bingo Game Logic**: Add controllers and models for bingo cards and games
4. **Billy Strings Integration**: Add endpoints for song recommendations
5. **Testing**: Add unit and integration tests
6. **Security**: Add rate limiting, helmet for security headers
7. **Logging**: Add proper logging middleware
8. **Documentation**: Add Swagger/OpenAPI documentation

## Architecture Notes

- **MVC Pattern**: The application follows the Model-View-Controller pattern
- **Error Handling**: Centralized error handling with custom error classes
- **Validation**: Input validation using custom validation utilities
- **Middleware**: Modular middleware for cross-cutting concerns
- **Separation of Concerns**: Clear separation between routes, controllers, models, and utilities
