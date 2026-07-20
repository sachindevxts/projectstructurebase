import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UiState } from '@/redux/store/store.types';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';

const initialState: UiState = {
  theme: (storage.get(STORAGE_KEYS.THEME, 'system') as 'light' | 'dark' | 'system') ?? 'system',
  sidebarOpen: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      storage.set(STORAGE_KEYS.THEME, action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
      }>,
    ) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setTheme, toggleSidebar, addNotification, clearNotifications } = uiSlice.actions;
export default uiSlice.reducer;
