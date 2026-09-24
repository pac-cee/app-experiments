# Quarks Group API Assessment

A simple REST API built for the Quarks Group backend development internship assessment. This API provides endpoints to create and retrieve user data stored in memory.

## Programming Language & Framework

- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Additional Libraries**: 
  - `uuid` for generating unique user IDs
  - `nodemon` for development (optional)

## Features

- ✅ Create users with auto-generated UUIDs
- ✅ Retrieve users by ID
- ✅ In-memory data storage
- ✅ Comprehensive error handling
- ✅ Input validation (email format, required fields)
- ✅ Duplicate email prevention
- ✅ JSON responses for all endpoints

## API Endpoints

### 1. Create User
**POST** `/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Success Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid input
- `409` - Email already exists
- `500` - Internal server error

### 2. Get User by ID
**GET** `/users/:id`

**Success Response (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Responses:**
- `404` - User not found
- `500` - Internal server error

### 3. Get All Users (Bonus)
**GET** `/users`

**Success Response (200):**
```json
{
  "count": 2,
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}
```

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd quarks-group-api-assessment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
