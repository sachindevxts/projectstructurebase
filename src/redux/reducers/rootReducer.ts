import { combineReducers } from 'redux';
import authReducer from '../slices/authSlice';
import dashboardReducer from '../slices/dashboardSlice';
import userReducer from '../slices/usersSlice';
import uiReducer from '../slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  users: userReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
