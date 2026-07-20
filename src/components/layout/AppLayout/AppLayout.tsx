import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar/Topbar';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';
import type { ReactNode } from 'react';

export function AppLayout({ children }: { children?: ReactNode }) {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Topbar />
        <div className="app-shell__body">
          <Sidebar />
          <main className="app-shell__content">{children ?? <Outlet />}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
