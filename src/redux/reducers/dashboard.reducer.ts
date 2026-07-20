import { DASHBOARD_ACTION_TYPES } from '../actionTypes';
import type { ApiError } from '@/types/common.types';
export interface DashboardReduxState {
  data: { totalProducts: number; totalUsers: number };
  loading: boolean;
  initialized: boolean;
  error: ApiError | null;
}
const initialState: DashboardReduxState = {
  data: { totalProducts: 0, totalUsers: 0 },
  loading: false,
  initialized: false,
  error: null,
};
export default function dashboardReducer(state = initialState, action: any): DashboardReduxState {
  switch (action.type) {
    case DASHBOARD_ACTION_TYPES.FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case DASHBOARD_ACTION_TYPES.FETCH_SUCCESS:
      return { ...state, loading: false, initialized: true, data: action.payload };
    case DASHBOARD_ACTION_TYPES.FETCH_FAILURE:
      return { ...state, loading: false, initialized: true, error: action.payload };
    case DASHBOARD_ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
}
