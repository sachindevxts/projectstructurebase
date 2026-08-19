import { Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { AppRoutes } from '@/routes/AppRoutes';
import { RouteFallback } from '@/routes/RouteFallback';

export function App() {
  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <AppRoutes />
      </Suspense>
      <Analytics />
    </>
  );
}
