import type { RootState } from '@/redux/store/configureStore';

export const selectUserState = (state: RootState) => state.users;
export const selectUsers = (state: RootState) => state.users.data;
export const selectUsersLoading = (state: RootState) => state.users.status === 'loading';
export const selectUsersInitialized = (state: RootState) => state.users.initialized;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectSelectedUser = () => null;
export const selectUsersSubmitting = () => false;
