import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the config utility
jest.mock('./utils/config', () => ({
  getConfig: jest.fn().mockResolvedValue({
    testVar: 'test-value',
    environment: 'test'
  }),
  AppConfig: {}
}));

test('renders CUFC React Frontend heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/CUFC React Frontend/i);
  expect(headingElement).toBeInTheDocument();
});
