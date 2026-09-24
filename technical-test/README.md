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
   ```

4. **Server will be running at:**
   ```
   http://localhost:3000
   ```

## Testing the API

### Using cURL Commands

#### 1. Create a new user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

#### 2. Get user by ID (replace with actual ID from creation):
```bash
curl -X GET http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000
```

#### 3. Get all users:
```bash
curl -X GET http://localhost:3000/users
```

#### 4. Test error handling - missing fields:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
```

#### 5. Test error handling - user not found:
```bash
curl -X GET http://localhost:3000/users/nonexistent-id
```

### Using Postman or Thunder Client

1. **Create User:**
   - Method: POST
   - URL: `http://localhost:3000/users`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "name": "Alice Johnson",
       "email": "alice@example.com"
     }
     ```

2. **Get User:**
   - Method: GET
   - URL: `http://localhost:3000/users/{user-id}`

### Test Scenarios Covered

- ✅ Successful user creation
- ✅ Successful user retrieval
- ✅ Missing required fields validation
- ✅ Invalid email format validation
- ✅ Duplicate email prevention
- ✅ User not found error handling
- ✅ Invalid route handling

## Project Structure

```
quarks-group-api-assessment/
├── server.js          # Main application file
├── package.json       # Project dependencies and scripts
├── README.md         # This documentation
└── .gitignore        # Git ignore file
```

## Error Handling

The API implements comprehensive error handling for:

- **Validation Errors**: Missing fields, invalid data types, malformed email
- **Business Logic Errors**: Duplicate emails, user not found
- **Server Errors**: Unexpected errors with proper logging
- **Route Errors**: 404 for undefined endpoints

All errors return consistent JSON responses with `error` and `message` fields.

## Technical Decisions

1. **UUID vs Incrementing Counter**: Used UUID for better uniqueness and scalability
2. **Email Validation**: Implemented basic regex validation for email format
3. **Case Sensitivity**: Emails are stored in lowercase to prevent duplicates
4. **Memory Storage**: Simple object-based storage as per requirements
