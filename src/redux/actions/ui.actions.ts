import type { ThemePreference } from '@/redux/reducers/ui.reducer';

export const setTheme = (theme: ThemePreference) => ({
  type: 'ui/setTheme' as const,
  payload: theme,
});

export const setSidebarOpen = (open: boolean) => ({
  type: 'ui/setSidebar' as const,
  payload: open,
});
