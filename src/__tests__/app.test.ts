import request from 'supertest';
import { Request, Response, NextFunction } from 'express';

// Mock the auth middleware
jest.mock('../../src/middleware/auth0.middleware', () => ({
  checkJwt: (_req: Request, _res: Response, next: NextFunction) => next()
}));

// Mock database connection
jest.mock('../../src/utils/database', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
  disconnectDB: jest.fn().mockResolvedValue(undefined)
}));

// Import the app after setting up mocks
import app from '..';

describe('App', () => {
  it('should return 200 and a test message from /api/test', async () => {
    const res = await request(app).get('/api/test');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('value', 'Hello from backend!');
  });
});
