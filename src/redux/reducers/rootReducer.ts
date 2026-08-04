import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import dashboardReducer from './dashboard.reducer';
import userReducer from './user.reducer';
import uiReducer from './ui.reducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  users: userReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;