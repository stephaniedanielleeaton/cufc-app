import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ value: 'test-value' }),
    ok: true
  }) as unknown as Promise<Response>
);

// Mock the config utility
jest.mock('./utils/config', () => {
  return {
    getConfig: () => Promise.resolve({
      testVar: 'test-value',
      environment: 'test'
    }),
    AppConfig: {}
  };
});

test('renders CUFC React Frontend heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/CUFC React Frontend/i);
  expect(headingElement).toBeInTheDocument();
});

