import * as React from 'react';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [backendValue, setBackendValue] = React.useState('');

  React.useEffect(() => {
    fetch('/api/test')
      .then((res) => res.json())
      .then((data) => setBackendValue(data.value))
      .catch(() => setBackendValue('Error connecting to backend'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={viteLogo} className="App-logo" alt="logo" />
        <h1>CUFC React Frontend</h1>
        <p>
          <strong>Backend Test Value:</strong> {backendValue || 'Loading...'}
        </p>
        <p>
          <strong>VITE_CUSTOM_VAR:</strong> {import.meta.env.VITE_CUSTOM_VAR || 'Not Set'}
        </p>
        <p>
          (Set this environment variable in Heroku to verify the build)
        </p>
      </header>
    </div>
  );
}

export default App;
