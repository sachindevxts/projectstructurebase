import { Suspense } from 'react';
import { AppRoutes } from '@/routes/AppRoutes';
import { RouteFallback } from '@/routes/RouteFallback';

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <AppRoutes />
    </Suspense>
  );
}
