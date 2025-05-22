import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../utils/database';
import { config } from '../../config';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn()
}));

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('Database Utility', () => {
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    // Mock console methods
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe('connectDB', () => {
    it('should connect to MongoDB with correct URI and options', async () => {
      // Mock successful connection
      (mongoose.connect as jest.Mock).mockResolvedValueOnce({
        connection: { host: 'test-host' }
      });

      await connectDB();

      // Check if mongoose.connect was called with correct params
      expect(mongoose.connect).toHaveBeenCalledWith(config.mongo.uri, {
        autoIndex: true,
        autoCreate: true
      });

      // Check if success message was logged
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('MongoDB Connected')
      );
    });

    it('should handle connection errors', async () => {
      // Mock missing URI
      const originalUri = config.mongo.uri;
      Object.defineProperty(config.mongo, 'uri', { value: '' });

      // Save original process.exit
      const originalExit = process.exit;
      
      // Completely mock process.exit to prevent test process termination
      process.exit = jest.fn() as any;

      // Call the function that would trigger process.exit
      await connectDB().catch(() => {/* catch error to continue test */});

      // Verify process.exit was called with code 1
      expect(process.exit).toHaveBeenCalledWith(1);

      // Restore original URI and process.exit
      Object.defineProperty(config.mongo, 'uri', { value: originalUri });
      process.exit = originalExit;
    });
  });

  describe('disconnectDB', () => {
    it('should disconnect from MongoDB', async () => {
      // Mock successful disconnection
      (mongoose.disconnect as jest.Mock).mockResolvedValueOnce(undefined);

      await disconnectDB();

      // Check if mongoose.disconnect was called
      expect(mongoose.disconnect).toHaveBeenCalled();
      
      // Check if success message was logged
      expect(console.log).toHaveBeenCalledWith('MongoDB Disconnected');
    });

    it('should handle disconnection errors', async () => {
      // Mock disconnection error
      const mockError = new Error('Disconnection failed');
      (mongoose.disconnect as jest.Mock).mockRejectedValueOnce(mockError);

      await disconnectDB();

      // Check if error message was logged
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error disconnecting from MongoDB')
      );
    });
  });
});
