import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import apiRoutes from './routes';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT ?? 3001;

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

// Define possible paths for frontend files (in order of preference)
const possiblePaths = [
  path.join(__dirname, '../cufc-frontend/dist'),
  path.join(__dirname, '../cufc-frontend/build'),
  path.join(__dirname, '../../cufc-frontend/dist'),
  path.join(__dirname, '../../cufc-frontend/build')
];

// Find the first valid path with index.html
let buildPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(path.join(p, 'index.html'))) {
    buildPath = p;
    console.log(`Found frontend files at: ${buildPath}`);
    break;
  } else {
    console.log(`No frontend files at: ${p}`);
  }
}

// Serve static files if we found them
if (buildPath) {
  app.use(express.static(buildPath));

  // Fallback: serve React's index.html for any unknown route (except API)
  app.get(/^\/?(?!api).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // Just handle API routes if we can't find frontend files
  console.error('No frontend files found in any expected location');
  app.get(/^\/?(?!api).*/, (_req: Request, res: Response) => {
    res.status(404).send('Frontend files not found. Check server logs for details.');
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (buildPath) {
    console.log(`Serving frontend from: ${buildPath}`);
  } else {
    console.log('WARNING: No frontend files found, only API routes will work');
  }
});

export default app;