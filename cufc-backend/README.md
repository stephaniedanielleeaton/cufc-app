# CUFC Backend

Backend services for the CUFC application built with Node.js, Express, and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example`
4. Run development server: `npm run dev`


### Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Run production server

## Project Structure

- `src/` - Source code
  - `controllers/` - Request handlers
  - `middlewares/` - Express middlewares
  - `models/` - Data models
  - `routes/` - API routes
  - `services/` - Business logic
  - `utils/` - Utility functions
  - `config.ts` - Configuration
  - `index.ts` - Application entry point