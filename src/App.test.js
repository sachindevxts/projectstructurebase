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

test('redirects unauthenticated users to the login page', async () => {
  render(React.createElement(TestApp));
  expect(await screen.findByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
