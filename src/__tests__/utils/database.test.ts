import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../utils/database';
import { config } from '../../config';

// Mock mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({ connection: { host: 'localhost' } }),
  disconnect: jest.fn().mockResolvedValue(undefined),
  connection: {
    close: jest.fn().mockResolvedValue(undefined),
    host: 'localhost'
  }
}));

// Access the mocked functions directly from the mongoose import
// This avoids TypeScript errors with complex types

jest.mock('../../config', () => ({
  config: {
    mongo: { uri: 'mongodb://localhost:27017/testdb' }
  }
}));

describe('database utils', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let processExitSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    originalEnv = { ...process.env };
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { /* empty mock */ });
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { /* empty mock */ });
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe('connectDB', () => {
    it('should connect to MongoDB and log success', async () => {
      // No need to mock again, already mocked in the jest.mock call
      await connectDB();
      expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb', expect.any(Object));
      expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Connected: localhost');
    });

    it('should throw error if URI is not defined', async () => {
      jest.resetModules();
      jest.doMock('../../config', () => ({ config: { mongo: { uri: '' } } }));
      // Using dynamic import instead of require to fix ESLint error
      const databaseModule = await import('../../utils/database');
      await databaseModule.connectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('MongoDB URI is not defined'));
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle connection error and exit process', async () => {
      // Reset the mock and set up a new rejection
      jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('Failed to connect'));
      await connectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB: Failed to connect');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle unknown error and exit process', async () => {
      jest.spyOn(mongoose, 'connect').mockRejectedValueOnce('some string error');
      await connectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB: Unknown error');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('disconnectDB', () => {
    it('should disconnect from MongoDB and log success', async () => {
      // Already mocked in the jest.mock setup
      await disconnectDB();
      expect(mongoose.disconnect).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Disconnected');
    });

    it('should handle disconnect error', async () => {
      jest.spyOn(mongoose, 'disconnect').mockRejectedValueOnce(new Error('Disconnect failed'));
      await disconnectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error disconnecting from MongoDB: Disconnect failed');
    });

    it('should handle unknown disconnect error', async () => {
      jest.spyOn(mongoose, 'disconnect').mockRejectedValueOnce('some string error');
      await disconnectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error disconnecting from MongoDB: Unknown error');
    });
  });
});
