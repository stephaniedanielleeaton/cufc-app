# CUFC Backend

Backend services for the CUFC application built with Node.js, Express, and TypeScript.

## Getting Started

### Prerequisites

- Node.js (v20.x)
- npm

### Installation

1. Clone the repository
2. Install backend dependencies: `npm install`
3. Install frontend dependencies: `cd cufc-frontend && npm install`
4. Create a `.env` file based on `.env.example`

### Local Development with Hot Reloading

For the best development experience with hot reloading for both frontend and backend:

```bash
npm run dev:all
```

This will:
- Start the backend server on port 3001 with nodemon (auto-reloading)
- Start the React development server on port 3000 with hot module replacement
- Proxy API requests from the frontend to the backend

### Other Scripts

- `npm run dev:backend` - Start only the backend with hot-reload
- `npm run dev:frontend` - Start only the frontend development server
- `npm run build` - Build the backend for production
- `npm start` - Run the production server
- `cd cufc-frontend && npm run lint` - Run ESLint on the frontend code (must be run from frontend directory)

## Deployment

### GitHub Actions Workflow

This project uses GitHub Actions for CI/CD. The workflow is defined in `.github/workflows/build-and-deploy.yml` and does the following:

1. Checks out the code
2. Sets up Node.js v20
3. Installs backend dependencies
4. Builds the backend TypeScript code
5. Installs frontend dependencies and builds the React frontend
   - The frontend is built during the CI/CD process, not during local development
   - This ensures consistent builds across environments
6. Commits the frontend build folder back to the repository

#### SonarQube Integration

The GitHub Actions workflow can be extended to include SonarQube analysis for code quality monitoring:

```yaml
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

To enable this:
1. Set up a SonarQube instance or use SonarCloud
2. Add `SONAR_TOKEN` and `SONAR_HOST_URL` to your GitHub repository secrets
3. Create a `sonar-project.properties` file in your repository root

The workflow runs automatically on every push to the main branch.

### Heroku Deployment

The application is configured for deployment to Heroku:

1. **First-time setup**:
   - Create a new Heroku app
   - Connect it to your GitHub repository
   - Set the required environment variables in Heroku's config vars

2. **Environment Variables**:
   - Set `WEB_CLIENT_TEST_VAR` and any other required variables in Heroku's dashboard
   - All sensitive information should only be stored in environment variables

3. **Deployment**:
   - After the GitHub Actions workflow completes, deploy from the Heroku dashboard
   - Alternatively, enable automatic deploys from the main branch

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