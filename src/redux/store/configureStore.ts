import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../reducers/rootReducer';
import { registerStore } from './storeRegistry';

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

registerStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
