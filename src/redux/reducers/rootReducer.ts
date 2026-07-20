import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import uiReducer from './ui.reducer';
import authReducer from './auth.reducer';
import dashboardReducer from './dashboard.reducer';

export const rootReducer = combineReducers({
  users: userReducer,
  ui: uiReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
