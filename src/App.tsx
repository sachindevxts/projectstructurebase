import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { store } from '@/redux/store';
import { AppRoutes } from '@/routes/AppRoutes';
import { RouteFallback } from '@/routes/RouteFallback';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <AppRoutes />
            </Suspense>
            <SpeedInsights />
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

