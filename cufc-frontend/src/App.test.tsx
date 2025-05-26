import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock React.useEffect to prevent API calls during testing
jest.spyOn(React, 'useEffect').mockImplementation(() => {});

test('renders CUFC React Frontend heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/CUFC React Frontend/i);
  expect(headingElement).toBeInTheDocument();
});

