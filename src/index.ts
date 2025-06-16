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

// Use the consistent frontend build path that we're setting in GitHub workflow
const buildPath = path.join(__dirname, '../cufc-frontend/dist');

// Log where we're looking for frontend files
console.log(`Looking for frontend files in: ${buildPath}`);

// Check if the directory exists and contains index.html
const indexExists = fs.existsSync(path.join(buildPath, 'index.html'));
console.log(`Frontend index.html exists: ${indexExists}`);

// Serve static files from the React app
app.use(express.static(buildPath));

// Fallback: serve React's index.html for any unknown route (except API)
app.get(/^\/?(?!api).*/, (_req: Request, res: Response) => {
  if (indexExists) {
    res.sendFile(path.join(buildPath, 'index.html'));
  } else {
    res.status(404).send('Frontend files not found. Make sure the build completed successfully.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving frontend from: ${buildPath}`);
});

export default app;