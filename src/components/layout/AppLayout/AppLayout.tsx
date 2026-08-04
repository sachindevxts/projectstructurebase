import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Topbar } from '../Topbar/Topbar';
import { Sidebar } from '../Sidebar/Sidebar';
import { ToastProvider } from '@/components/common/Toast/ToastProvider';
import styles from './AppLayout.module.scss';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <ToastProvider>
      <Box className={styles.appShell}>
        <Sidebar />
        <Box className={styles.appBody}>
          <Topbar />
          <Box component="main" className={styles.appContent}>
            {children ?? <Outlet />}
          </Box>
        </Box>
      </Box>
    </ToastProvider>
  );
};

export default AppLayout;