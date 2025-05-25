/**
 * Configuration utility for fetching runtime environment variables from the backend
 */

export interface AppConfig {
  testVar: string;
  environment: string;
}

let cachedConfig: AppConfig | null = null;

/**
 * Fetches configuration from the backend API
 * Uses caching to avoid multiple requests
 */
export async function getConfig(): Promise<AppConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/api/config');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch config: ${response.statusText}`);
    }
    
    const config = await response.json() as AppConfig;
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Error fetching configuration:', error);
    // Return default values as fallback
    return {
      testVar: 'fallback_test_value',
      environment: 'development'
    };
  }
}
