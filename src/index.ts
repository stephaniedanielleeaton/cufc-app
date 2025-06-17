import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { connectDB } from './utils/database';
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT ?? 3001;

// Connect to MongoDB
connectDB()
  .then(() => console.log('MongoDB connection established'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
 app.use('/api', apiRoutes);

// Test endpoint
app.get('/api/test', (_req: Request, res: Response) => {
  res.json({ value: 'Hello from backend!' });
});

// Serve static files from Vite's build output
const distPath = path.resolve(__dirname, '..', 'cufc-frontend', 'dist');
app.use(express.static(distPath));
console.log('Serving static files from:', distPath);
// Fallback to index.html for React Router (must be after API routes)
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
