import type { ThemePreference } from '@/redux/reducers/ui.reducer';
import {
  setSidebarOpen as setSidebarOpenAction,
  setTheme as setThemeAction,
} from '../slices/uiSlice';

export const setTheme = (theme: ThemePreference) => setThemeAction(theme);

export const setSidebarOpen = (open: boolean) => setSidebarOpenAction(open);
