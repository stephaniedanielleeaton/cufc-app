import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount API routes
app.use('/api', apiRoutes);

// Test endpoint
app.get('/api/test', (req: Request, res: Response) => {
  res.json({ value: 'Hello from backend!' });
});

import path from 'path';

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../cufc-frontend/build')));

// Fallback: serve React's index.html for any unknown route (except API)
app.get(/^\/(?!api).*/, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../cufc-frontend/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;