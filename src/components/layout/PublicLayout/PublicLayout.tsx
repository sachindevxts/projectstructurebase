import { Outlet } from 'react-router-dom';
import type { ReactNode } from 'react';

export function PublicLayout({ children }: { children?: ReactNode }) {
  return <div className="public-layout">{children ?? <Outlet />}</div>;
}
