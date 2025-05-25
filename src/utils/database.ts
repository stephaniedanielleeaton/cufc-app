import mongoose from 'mongoose';
import { config } from '../config';

// Mongoose connection options
const options = {
  autoIndex: true,
  autoCreate: true
};

/**
 * Connect to MongoDB database
 */
export const connectDB = async (): Promise<void> => {
  try {
    if (!config.mongo.uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    const connection = await mongoose.connect(config.mongo.uri, options);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
