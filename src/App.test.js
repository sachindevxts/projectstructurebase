import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './redux/store';

const TestApp = () =>
  React.createElement(
    Provider,
    { store },
    React.createElement(MemoryRouter, null, React.createElement(App)),
  );

test('renders the UI-only dashboard without requiring a backend session', async () => {
  render(React.createElement(TestApp));
  expect(await screen.findByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument();
  expect(screen.getByText(/total employees/i)).toBeInTheDocument();
});
