describe('Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('should have port from environment variables', async () => {
    process.env.PORT = '5000';
    // Re-import to get updated config with new env vars
    jest.resetModules();
    const { config } = await import('../config');
    expect(config.port).toBe('5000');
  });

  test('should have nodeEnv from environment variables', async () => {
    process.env.NODE_ENV = 'production';
    // Re-import to get updated config with new env vars
    jest.resetModules();
    const { config } = await import('../config');
    expect(config.nodeEnv).toBe('production');
  });

  test('should have MongoDB URI from environment variables', async () => {
    const testMongoUri = 'mongodb://test-uri';
    process.env.MONGO_URI = testMongoUri;
    // Re-import to get updated config with new env vars
    jest.resetModules();
    const { config } = await import('../config');
    expect(config.mongo).toBeDefined();
    expect(config.mongo.uri).toBe(testMongoUri);
  });
});
