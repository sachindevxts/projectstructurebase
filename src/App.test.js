import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the login screen without requiring a backend session', async () => {
  render(React.createElement(App));
  expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
});
