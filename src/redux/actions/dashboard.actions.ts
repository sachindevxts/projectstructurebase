import { dashboardService } from '@/api/services/dashboard.service';
import { normalizeApiError } from '@/api/errorHandler';
import type { AppThunk } from '../store';
import { DASHBOARD_ACTION_TYPES } from '../actionTypes';

export const fetchDashboard = (): AppThunk => async (dispatch) => {
  dispatch({ type: DASHBOARD_ACTION_TYPES.FETCH_REQUEST });
  try {
    const data = await dashboardService.getSummary();
    dispatch({
      type: DASHBOARD_ACTION_TYPES.FETCH_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DASHBOARD_ACTION_TYPES.FETCH_FAILURE,
      payload: normalizeApiError(error),
    });
  }
};

export const clearDashboard = () => ({ type: DASHBOARD_ACTION_TYPES.CLEAR });