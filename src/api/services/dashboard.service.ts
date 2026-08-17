import { API_ENDPOINTS } from '@/constants/api.constants';
import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';

export interface DashboardSummary {
  totalProducts: number;
  totalUsers: number;
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  billableEmployees: number;
  nonBillableEmployees: number;
  benchEmployees: number;
  totalProjects: number;
  activeProjects: number;
  plannedProjects: number;
  allocationsEndingSoon: number;
  billablePercentage: number;
}

interface BackendDashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  billableEmployees: number;
  nonBillableEmployees: number;
  benchEmployees: number;
  totalProjects: number;
  activeProjects: number;
  plannedProjects: number;
  allocationsEndingSoon: number;
}

export type DashboardWidgetType =
  | 'TOTAL_EMPLOYEES'
  | 'ACTIVE_EMPLOYEES'
  | 'ACTIVE_PROJECTS'
  | 'BILLABLE_EMPLOYEES'
  | 'BENCH_EMPLOYEES'
  | 'RELEASING_SOON'
  | 'BILLABLE_SPLIT'
  | 'ALLOCATION_DISTRIBUTION';

export interface DashboardWidget {
  id: string;
  title: string;
  type: DashboardWidgetType;
  size: 'sm' | 'md' | 'lg';
  enabled: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDashboardWidgetPayload {
  type: DashboardWidgetType;
  title?: string;
  size?: DashboardWidget['size'];
  enabled?: boolean;
  sortOrder?: number;
}

export type UpdateDashboardWidgetPayload = Partial<CreateDashboardWidgetPayload>;

async function getSummary(): Promise<DashboardSummary> {
  const response = await api.get<ApiEnvelope<BackendDashboardSummary>>(
    API_ENDPOINTS.DASHBOARD.SUMMARY,
  );
  const summary = unwrapApiData(response.data);
  const billablePercentage = summary.activeEmployees
    ? Math.round((summary.billableEmployees / summary.activeEmployees) * 100)
    : 0;

  return {
    ...summary,
    totalProducts: summary.totalProjects,
    totalUsers: summary.totalEmployees,
    billablePercentage,
  };
}

async function getWidgets(): Promise<DashboardWidget[]> {
  const response = await api.get<ApiEnvelope<DashboardWidget[]>>(
    API_ENDPOINTS.DASHBOARD.WIDGETS,
  );
  return unwrapApiData(response.data);
}

async function createWidget(
  payload: CreateDashboardWidgetPayload,
): Promise<DashboardWidget> {
  const response = await api.post<ApiEnvelope<DashboardWidget>>(
    API_ENDPOINTS.DASHBOARD.WIDGETS,
    payload,
  );
  return unwrapApiData(response.data);
}

async function updateWidget(
  id: string,
  payload: UpdateDashboardWidgetPayload,
): Promise<DashboardWidget> {
  const response = await api.patch<ApiEnvelope<DashboardWidget>>(
    `${API_ENDPOINTS.DASHBOARD.WIDGETS}/${id}`,
    payload,
  );
  return unwrapApiData(response.data);
}

async function deleteWidget(id: string): Promise<void> {
  await api.delete(`${API_ENDPOINTS.DASHBOARD.WIDGETS}/${id}`);
}

export const dashboardService = {
  getSummary,
  getWidgets,
  createWidget,
  updateWidget,
  deleteWidget,
};
