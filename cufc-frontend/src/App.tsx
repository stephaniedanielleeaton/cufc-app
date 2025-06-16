import React from 'react';
import './App.css';
import { getConfig } from './utils/config';
import type { AppConfig } from './utils/config';

function App() {
  const [backendValue, setBackendValue] = React.useState('');
  const [config, setConfig] = React.useState<AppConfig | null>(null);
  const [configLoading, setConfigLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch backend test value
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => setBackendValue(data.value))
      .catch(() => setBackendValue('Error connecting to backend'));
    
    // Fetch configuration from backend
    getConfig()
      .then(configData => {
        setConfig(configData);
        setConfigLoading(false);
      })
      .catch(error => {
        console.error('Failed to load config:', error);
        setConfigLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CUFC React Frontend</h1>
        <p>
          <strong>Backend Test Value:</strong> {backendValue || 'Loading...'}
        </p>
        <p>
          <strong>Environment:</strong> {configLoading ? 'Loading...' : config?.environment || 'Not Set'}
        </p>
        <p>
          <strong>WEB_CLIENT_TEST_VAR:</strong> {configLoading ? 'Loading...' : config?.testVar || 'Not Set'}
        </p>
        <p>
          (These values are loaded from backend environment variables)
        </p>
      </header>
    </div>
  );
}

export default App;
