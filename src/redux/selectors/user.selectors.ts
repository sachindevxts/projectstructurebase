import type { RootState } from '@/redux/store/configureStore';

export const selectUserState = (state: RootState) => state.users;
export const selectUsers = (state: RootState) => state.users.users;
export const selectUsersLoading = (state: RootState) => state.users.loading;
export const selectUsersInitialized = (state: RootState) => state.users.initialized;
export const selectUsersError = (state: RootState) => state.users.error;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;
export const selectUsersSubmitting = (state: RootState) => state.users.submitting;
