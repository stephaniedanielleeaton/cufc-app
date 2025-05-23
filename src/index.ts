import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './utils/database';
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();
const PORT = process.env.PORT ?? 3000;

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

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('CUFC Backend API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;