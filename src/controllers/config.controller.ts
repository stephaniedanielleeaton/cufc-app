import { Request, Response } from 'express';

/**
 * ConfigController handles serving configuration and environment variables
 * to the frontend in a secure way
 */
export class ConfigController {
  /**
   * Get public configuration values that the frontend needs
   * Only expose non-sensitive configuration here
   */
  async getPublicConfig(req: Request, res: Response): Promise<void> {
    // Only expose variables that are safe for the client
    const publicConfig = {
      apiUrl: process.env.API_URL || '',
      auth0Domain: process.env.AUTH0_DOMAIN || '',
      auth0ClientId: process.env.AUTH0_CLIENT_ID || '',
      environment: process.env.NODE_ENV || 'development'
    };

    res.json(publicConfig);
  }
}
