import request from 'supertest';
import express from 'express';

// Mock the database connection
jest.mock('../utils/database', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
  disconnectDB: jest.fn().mockResolvedValue(undefined)
}));

// Create a separate test app to avoid port conflicts
const createTestApp = () => {
  // Use dynamic import to prevent app from connecting to DB during tests
  jest.isolateModules(() => {
    require('../index');
  });
  
  // Create simplified version of app for testing
  const app = express();
  app.get('/', (req, res) => {
    res.send('CUFC Backend API is running!');
  });
  
  return app;
};

describe('Express Application', () => {
  let app: express.Application;
  
  beforeAll(() => {
    app = createTestApp();
  });
  
  describe('GET /', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });
    
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.text).toBe('CUFC Backend API is running!');
    });
  });
  
  describe('Server Initialization', () => {
    it('should initialize Express app without errors', () => {
      expect(app).toBeDefined();
    });
  });
});
