import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AppRoutes } from '@/routes/AppRoutes';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
