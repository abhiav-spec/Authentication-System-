# Authentication System

A Node.js authentication backend built with Express and MongoDB.

This project provides:
- User registration and login
- Email verification with OTP
- JWT access token and refresh token flow
- Session management with single logout and logout-all

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Authentication Flow](#authentication-flow)
- [API Base URL](#api-base-url)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Run the Server](#run-the-server)
- [Testing APIs Quickly](#testing-apis-quickly)
- [Data Models](#data-models)
- [Error Responses](#error-responses)
- [Known Notes](#known-notes)
- [Scripts](#scripts)

## Project Overview

This backend uses cookie-based refresh tokens and short-lived JWT access tokens.

- Access token: sent in response body, used in Authorization header
- Refresh token: stored in an HttpOnly cookie and rotated on refresh
- Sessions: stored in MongoDB with revoke support

## Tech Stack

- Node.js
- Express 5
- MongoDB + Mongoose
- JSON Web Token (JWT)
- Cookie Parser
- Nodemailer (Gmail OAuth2)
- otp-generator

## Project Structure

```text
Authentication-System-/
  backend/
    package.json
    server.js
    src/
      app.js
      config/
        config.js
        database.js
      controllers/
        auth.controller.js
      models/
        user.model.js
        session.model.js
        otp.model.js
      routes/
        auth.route.js
      services/
        email.service.js
      utils/
        otp.util.js
```

## Features

- Register with username, email, password
- OTP email generation and storage
- Verify email using OTP
- Login only for verified users
- Access token refresh
- Logout current session
- Logout all sessions for a user
- Profile retrieval using bearer access token

## Authentication Flow

1. Register user -> returns access token and sets refresh token cookie.
2. OTP is generated and emailed.
3. Verify email using OTP.
4. Login (only verified user) -> returns access token and sets refresh token cookie.
5. Use access token for protected routes.
6. Use refresh token cookie to get new access token.
7. Logout or logout-all revokes session(s).

## API Base URL

For local development:

```text
http://localhost:3000/api/auth
```

## API Endpoints

### 1) Register

- Method: POST
- Path: /register
- Body:

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "Pass1234"
}
```

- Success: 201

### 2) Verify Email

- Method: POST
- Path: /verify-email
- Body:

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

- Success: 200
- Failure: 400 Invalid OTP

### 3) Login

- Method: POST
- Path: /login
- Body:

```json
{
  "email": "john@example.com",
  "password": "Pass1234"
}
```

- Success: 200
- Failure: 400 if email is not verified or credentials are wrong

### 4) Get Profile

- Method: GET
- Path: /profile
- Header:

```text
Authorization: Bearer <accessToken>
```

- Success: 200

### 5) Refresh Token

- Method: GET
- Path: /refresh-token
- Uses cookie: refreshToken

- Success: 200 returns a new accessToken and rotates refresh token cookie

### 6) Logout (Current Session)

- Method: GET
- Path: /logout
- Uses cookie: refreshToken

- Success: 200

### 7) Logout All Sessions

- Method: GET
- Path: /logout-all
- Uses cookie: refreshToken

- Success: 200

## Environment Variables

Create an .env file in the project root (Authentication-System-/.env):

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/auth_db
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_gmail_address
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
ACCESS_TOKEN=your_google_oauth_access_token

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
GOOGLE_USER=your_google_user
```

Notes:
- MONGODB_URI or MONGO_URI is required.
- JWT_SECRET is required.
- The current config file also checks GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN, and GOOGLE_USER.

## Getting Started

1. Go to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Add .env at project root.

4. Start MongoDB.

## Run the Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```text
http://localhost:3000
```

## Testing APIs Quickly

Use Postman or curl. Example register request:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"Pass1234"}'
```

## Data Models

### User

- username: String, unique, required
- email: String, unique, required
- password: String (sha256 hash), required
- verified: Boolean, default false

### Session

- user: ObjectId ref User
- refreshToken: String (sha256 hash)
- ip: String
- userAgent: String
- revoked: Boolean, default false

### Otp

- email: String, unique
- otpHash: String

## Error Responses

Common error format:

```json
{ "error": "Internal server error" }
```

Other examples:
- 400 Username or email already exists
- 400 Invalid email or password
- 400 Invalid OTP
- 401 Unauthorized
- 404 User not found

## Known Notes

- Passwords are currently hashed with sha256 directly. In production, use bcrypt with salt.
- Profile endpoint currently returns full user document including hashed password. Consider excluding password before sending response.
- Secure cookie is enabled. Over plain HTTP local setups, browser cookie handling may vary.

## Scripts

From backend folder:

- npm run dev: run with nodemon
- npm start: run server with node
- npm test: placeholder script
