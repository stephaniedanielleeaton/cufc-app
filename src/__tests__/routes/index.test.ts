import request from 'supertest';
import express, { Application } from 'express';
import apiRoutes from '../../routes';
import memberRoutes from '../../routes/member.routes';

// Mock the member routes
jest.mock('../../routes/member.routes', () => {
  const router = express.Router();
  router.get('/test', (req, res) => {
    res.status(200).json({ message: 'Member routes test endpoint' });
  });
  return router;
});

describe('API Routes Index', () => {
  let app: Application;

  beforeEach(() => {
    // Create Express app and mount routes
    app = express();
    app.use(express.json());
    app.use('/api', apiRoutes);
  });

  it('should correctly mount member routes', async () => {
    // Test that the member routes are correctly mounted
    const response = await request(app).get('/api/members/test');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Member routes test endpoint' });
  });
});
