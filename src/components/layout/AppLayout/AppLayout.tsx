import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar/Topbar';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';

export function AppLayout() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Topbar />
        <div className="app-shell__body">
          <Sidebar />
          <main className="app-shell__content">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
