import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from '@/redux/store';

test('renders the login screen without requiring a backend session', async () => {
  render(React.createElement(Provider, { store }, React.createElement(App)));

  expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
});
