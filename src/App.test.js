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

test('renders the app shell by default', () => {
  render(React.createElement(TestApp));
  expect(screen.getByText(/project structure/i)).toBeInTheDocument();
  expect(screen.getByText(/guest/i)).toBeInTheDocument();
});
