import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { connectDB } from './utils/database';
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT ?? 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// Test endpoint
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ value: 'Hello from backend!' });
});

// In production, serve static files from the React app
if (isProduction) {
  // First, try the Vite build directory (for local production testing)
  const viteBuildPath = path.join(__dirname, '../cufc-frontend/dist');
  // Then try the Heroku build directory
  const herokuBuildPath = path.join(__dirname, '../../client/build');
  // Then try the root build directory (common in some setups)
  const rootBuildPath = path.join(__dirname, '../build');
  
  // Try to serve from any of the possible build directories
  [viteBuildPath, herokuBuildPath, rootBuildPath].forEach(buildPath => {
    if (fs.existsSync(path.join(buildPath, 'index.html'))) {
      console.log(`Serving static files from ${buildPath}`);
      app.use(express.static(buildPath));
      
      // Handle React Router, return all requests to React app
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(buildPath, 'index.html'));
      });
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running in ${isProduction ? 'production' : 'development'} mode on port ${PORT}`);
});

export default app;