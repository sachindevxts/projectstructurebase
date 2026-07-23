import { Route, Routes } from 'react-router-dom';
import { routeConfig, getRouteLayout } from './routeConfig';
export function AppRoutes() {
  return (
    <Routes>
      {routeConfig.map((route, index) => {
        const Layout = getRouteLayout(route.layout);
        return (
          <Route
            key={`${route.path}-${index}`}
            path={route.path}
            element={<Layout>{route.element}</Layout>}
          />
        );
      })}
    </Routes>
  );
}
