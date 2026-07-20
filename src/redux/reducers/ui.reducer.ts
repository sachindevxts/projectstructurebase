import { STORAGE_KEYS } from '@/constants/storage.constants';
import { storage } from '@/utils/storage.utils';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface UiReduxState {
  theme: ThemePreference;
  sidebarOpen: boolean;
}
const storedTheme = storage.get<ThemePreference>(STORAGE_KEYS.THEME, 'system');
const initialState: UiReduxState = {
  theme: storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system',
  sidebarOpen: false,
};
export default function uiReducer(state = initialState, action: any): UiReduxState {
  switch (action.type) {
    case 'ui/setTheme':
      return { ...state, theme: action.payload };
    case 'ui/setSidebar':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}
