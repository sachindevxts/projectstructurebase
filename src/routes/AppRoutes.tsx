import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { routeConfig, getRouteLayout } from '@/routes/routeConfig';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PublicRoute } from '@/routes/PublicRoute';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { bootstrapAuth } from '@/redux/slices/authSlice';

export function AppRoutes() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const authState = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <Routes>
      {routeConfig.map((route) => {
        const Layout = getRouteLayout(route.layout);
        const content = route.isProtected ? (
          <ProtectedRoute
            allowedRoles={route.allowedRoles}
            requiredPermissions={route.requiredPermissions}
          >
            {route.element}
          </ProtectedRoute>
        ) : (
          <PublicRoute>{route.element}</PublicRoute>
        );

        return <Route key={route.path} path={route.path} element={<Layout>{content}</Layout>} />;
      })}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
