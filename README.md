# Node.js Cloud Project Ideas Backend

## Overview
This backend application provides AI-powered cloud project ideas using both OpenAI and Gemini APIs. It is built with Node.js and Express, follows RESTful principles, and is structured for scalability, maintainability, and security.

## Features
- **AI-powered project ideas:** Get tailored cloud project ideas using OpenAI or Gemini (Google) APIs.
- **Provider selection:** Choose between OpenAI and Gemini by specifying the provider in your request.
- **Rate limiting:** Prevents abuse and bulk/fake traffic with both global and endpoint-specific rate limiting.
- **Security headers:** Uses Helmet to set secure HTTP headers.
- **CORS protection:** Restricts API access to allowed origins.
- **Payload size validation:** Blocks suspiciously large requests to prevent abuse.
- **Centralized error handling:** Consistent error responses for all endpoints.
- **Modular structure:** Clean separation of controllers, routes, and middleware for easy maintenance.

## Project Structure
```
nodejs-backend
├── src
│   ├── controllers          # Business logic for handling requests (projectIdeasController.js)
│   ├── middlewares          # Security, logging, error handling, rate limiting, CORS, etc.
│   ├── routes               # API route definitions (projectIdeasRoutes.js)
│   ├── utils                # Utility functions and custom error classes
│   ├── app.js               # Express app setup and middleware registration
│   └── server.js            # Entry point for starting the server
├── .env                     # Environment variables (API keys, etc.)
├── .gitignore               # Files and directories to ignore in version control
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd nodejs-backend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory and add your environment variables:
   ```
   API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3000
   NODE_ENV=development
   ```
4. Start the server:
   ```
   npm start
   ```

## Usage
- The main endpoint is:
  - `POST /api/project-ideas` — Get AI-generated project ideas (choose provider with `{ provider: 'openai' | 'gemini' }` in the request body)
- Example request body:
  ```json
  {
    "cloudProvider": "Azure",
    "experienceLevel": "Beginner",
    "serviceList": ["Azure Functions", "Azure OpenAI"],
    "provider": "gemini"
  }
  ```
- The response will be a JSON array of project idea objects as described in the prompt.

## Security Features
- **Rate limiting** (global and per-endpoint)
- **Helmet** for secure HTTP headers
- **CORS** with allowed origins
- **Payload size validation**
- **Centralized error handling**

## API Details
See `src/routes/projectIdeasRoutes.js` and `src/controllers/projectIdeasController.js` for endpoint and payload details.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.