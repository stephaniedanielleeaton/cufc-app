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

// Determine the frontend build path (works for both CRA and Vite)
const buildPath = fs.existsSync(path.join(__dirname, '../cufc-frontend/build')) 
  ? path.join(__dirname, '../cufc-frontend/build') 
  : path.join(__dirname, '../cufc-frontend/dist');

// Serve static files from the React app
app.use(express.static(buildPath));

// Fallback: serve React's index.html for any unknown route (except API)
app.get(/^\/?(?!api).*/, (_req: Request, res: Response) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} using frontend at ${buildPath}`);
});

export default app;