import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders the UI-only dashboard without requiring a backend session', async () => {
  render(React.createElement(App));

  expect(await screen.findByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument();
  expect(screen.getByText(/live intent capture/i)).toBeInTheDocument();
  expect(screen.getByText('PENDING APPROVAL')).toBeInTheDocument();
});
