import request from 'supertest';
import express, { Application, Request, Response, NextFunction } from 'express';

// Mock the auth middleware
jest.mock('../../middleware/auth0.middleware', () => ({
  checkJwt: (_req: Request, _res: Response, next: NextFunction) => next()
}));

// Mock the member routes
const mockMemberRouter = express.Router();
mockMemberRouter.get('/test', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'Member routes test endpoint' });
});

jest.mock('../../routes/member.routes', () => mockMemberRouter);

// Import the routes after setting up mocks
import apiRoutes from '../../routes';

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
