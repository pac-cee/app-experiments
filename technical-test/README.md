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
