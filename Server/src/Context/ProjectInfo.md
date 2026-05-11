# Project Overview: Payment Gateway (Server)

A Node.js backend for a Payment Gateway system, built using Express and MongoDB. The project follows a modular architecture with a clear separation of concerns using Controllers, Services, and Models.

## Core Technologies
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Security:** bcryptjs for password hashing, jsonwebtoken (JWT) for authentication via HTTP-only cookies (`cookie-parser`).

## Project Structure
The project logic is contained within the `Server` directory:
- `server.js`: The entry point. Handles DB connection and server initialization.
- `src/app.js`: Configures middleware (including `cookie-parser`) and routes.
- `src/config/`: Configuration (e.g., Database).
- `src/controller/`: Handles HTTP requests.
- `src/services/`: Business logic.
- `src/models/`: Mongoose schemas.
- `src/routes/`: API endpoints.
- `src/middleware/`: Custom middleware (e.g., Auth checks).
- `src/utils/`: Helper functions (e.g., `generateToken` for JWT).

## Building and Running

### Prerequisites
- Node.js installed.
- MongoDB instance (local or Atlas).
- Environment variables configured in a `.env` file within the `Server` directory.

### Key Commands (run from the `Server` directory)
- **Start Server:** `npm start` (Runs `node server.js`)
- **Development Mode:** `npx nodemon server.js` (Recommended for development)
- **Install Dependencies:** `npm install`

### Environment Variables
Required variables in `Server/.env`:
- `MONGO_URI`: MongoDB connection string.
- `PORT`: (Optional) Port number for the server (defaults to 3000).
- `JWT_SECRET`: Secret key for signing JWT tokens.
- `NODE_ENV`: Set to `development` for local testing (allows cookies over HTTP) or `production`.

## Feature Implementations

### Authentication Flow
- **Register/Login**: Verifies credentials and uses `generateToken` utility to sign a JWT and set it as an HTTP-only cookie (`jwt`).
- **Logout**: Clears the `jwt` cookie by setting it to an empty string and expiring it immediately.
- **Middleware (`protect`)**: Intercepts requests, verifies the JWT cookie using `JWT_SECRET`, and attaches the user object (minus password) to `req.user`.

### API Endpoints
- `POST /api/auth/register`: Public - Register new user.
- `POST /api/auth/login`: Public - Authenticate user & get cookie.
- `POST /api/auth/logout`: Public - Clear authentication cookie.
- `GET /api/auth/profile`: Protected - Returns the currently logged-in user's profile info.

## Development Conventions
- **Module System:** Uses ES Modules (`import`/`export`).
- **Architecture:** Controller-Service-Model pattern.
  - **Controllers:** Keep them thin; focus on request validation and response formatting.
  - **Services:** Implement business logic here.
  - **Models:** Define schemas and database-level hooks (e.g., password hashing).
- **Naming Conventions:**
  - Files: CamelCase or kebab-case (mostly CamelCase seen in current structure).
  - Functions/Variables: camelCase.
  - Models: PascalCase.
- **Error Handling:** Use try-catch blocks in controllers and services, returning appropriate HTTP status codes.
