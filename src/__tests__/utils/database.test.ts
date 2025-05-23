import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../utils/database';
import { config } from '../../config';

jest.mock('mongoose');
const mockedMongoose = mongoose as jest.Mocked<typeof mongoose>;

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
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  describe('connectDB', () => {
    it('should connect to MongoDB and log success', async () => {
      mockedMongoose.connect.mockResolvedValue({ connection: { host: 'localhost' } } as any);
      await connectDB();
      expect(mockedMongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/testdb', expect.any(Object));
      expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Connected: localhost');
    });

    it('should throw error if URI is not defined', async () => {
      jest.resetModules();
      jest.doMock('../../config', () => ({ config: { mongo: { uri: '' } } }));
      const { connectDB: connectDBReloaded } = require('../../utils/database');
      await connectDBReloaded();
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('MongoDB URI is not defined'));
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle connection error and exit process', async () => {
      mockedMongoose.connect.mockRejectedValue(new Error('Failed to connect'));
      await connectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB: Failed to connect');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle unknown error and exit process', async () => {
      mockedMongoose.connect.mockRejectedValue('some string error');
      await connectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error connecting to MongoDB: Unknown error');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('disconnectDB', () => {
    it('should disconnect from MongoDB and log success', async () => {
      mockedMongoose.disconnect.mockResolvedValue();
      await disconnectDB();
      expect(mockedMongoose.disconnect).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('MongoDB Disconnected');
    });

    it('should handle disconnect error', async () => {
      mockedMongoose.disconnect.mockRejectedValue(new Error('Disconnect failed'));
      await disconnectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error disconnecting from MongoDB: Disconnect failed');
    });

    it('should handle unknown disconnect error', async () => {
      mockedMongoose.disconnect.mockRejectedValue('some string error');
      await disconnectDB();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error disconnecting from MongoDB: Unknown error');
    });
  });
});
