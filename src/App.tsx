import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from '@/redux/store';
import { AppRoutes } from '@/routes/AppRoutes';
import { RouteFallback } from '@/routes/RouteFallback';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';
import theme from './styles/theme';
// import { theme } from '@/styles/theme';

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <AppRoutes />
            </Suspense>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;