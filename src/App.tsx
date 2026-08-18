import { Suspense } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AppRoutes } from '@/routes/AppRoutes';
import { RouteFallback } from '@/routes/RouteFallback';

export function App() {
  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <AppRoutes />
      </Suspense>
      <SpeedInsights />
    </>
  );
}
