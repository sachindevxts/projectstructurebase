import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import dashboardReducer from '../slices/dashboardSlice';
import uiReducer from '../slices/uiSlice';
import usersReducer from '../slices/usersSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  users: usersReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
