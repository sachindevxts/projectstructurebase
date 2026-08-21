import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';

export type TicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type TicketCategory =
  | 'HARDWARE'
  | 'SOFTWARE'
  | 'NETWORK_VPN'
  | 'EMAIL_ACCOUNT_ACCESS'
  | 'PASSWORD_ACCESS_REQUEST'
  | 'APPLICATION_ISSUE'
  | 'SECURITY_INCIDENT'
  | 'DEVICE_REQUEST'
  | 'OTHER';

export interface ITTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  description: string;
  category: TicketCategory;
  subcategory?: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  requesterEmail: string;
  department?: string | null;
  assignedAgentUserId?: string | null;
  relatedAssetId?: string | null;
  comments: Array<{ id: string; authorEmail: string; body: string; internal: boolean; createdAt: string }>;
  internalNotes: Array<{ id: string; authorEmail: string; body: string; internal: boolean; createdAt: string }>;
  slaDueAt: string;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ITAsset {
  id: string;
  assetTag: string;
  serialNumber: string;
  type: string;
  brand: string;
  model: string;
  osVersion?: string | null;
  warrantyExpiry?: string | null;
  vendor?: string | null;
  location?: string | null;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_REPAIR' | 'RETIRED' | 'LOST';
  assignedEmployeeId?: string | null;
  notes?: string | null;
}

export interface ITSetupRequest {
  id: string;
  type: 'ONBOARDING' | 'OFFBOARDING';
  employeeId: string;
  employeeName: string;
  department?: string | null;
  designation?: string | null;
  dueDate?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
  checklist: Array<{ id: string; label: string; status: string; ownerUserId?: string | null }>;
}

export interface ITSoftwareLicence {
  id: string;
  name: string;
  vendor: string;
  category: string;
  licenceCount: number;
  assignedCount: number;
  availableCount: number;
  expiryDate?: string | null;
  renewalDate?: string | null;
}

export interface ITConfiguration {
  id: string;
  key: string;
  label: string;
  values: string[];
}

export interface ITDashboard {
  period: { range: string; from: string; to: string; timezone: string };
  ticketMetrics: {
    open: number;
    unassigned: number;
    critical: number;
    slaBreached: number;
    averageResolutionHours: number;
    openTrendPercentage: number;
    resolutionTrendPercentage: number;
  };
  assetMetrics: {
    assigned: number;
    available: number;
  };
  onboardingMetrics: { pending: number; dueThisWeek: number };
  licenceMetrics: { expiringWithin30Days: number };
  ticketVolumeAndSla: Array<{ date: string; volume: number; slaCompliancePercentage: number }>;
  ticketsByStatus: Array<{ status: TicketStatus; count: number }>;
  assetsByType: Array<{ assetType: string; count: number }>;
  criticalAndOverdueTickets: Array<{
    id: string;
    ticketNumber: string;
    title: string;
    requester: { id: string; name: string; avatarUrl: string | null };
    priority: TicketPriority;
    status: TicketStatus;
    dueAt: string;
    overdueMinutes: number;
  }>;
  expiringLicences: Array<{
    id: string;
    name: string;
    plan: string;
    logoUrl: string | null;
    expiresAt: string;
    daysRemaining: number;
  }>;
  inventoryAlerts: Array<{
    assetTypeId: string;
    name: string;
    available: number;
    threshold: number;
    severity: 'WARNING' | 'CRITICAL';
  }>;
  generatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
}

interface PaginatedEnvelope<T> extends ApiEnvelope<T[]> {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
}

const toPaginated = <T>(response: PaginatedEnvelope<T>): PaginatedResponse<T> => ({
  data: unwrapApiData(response),
  page: response.page,
  limit: response.limit,
  totalRecords: response.totalRecords,
  totalPages: response.totalPages,
  totalItems: response.totalItems,
});

const getDashboard = async (params?: Record<string, string>) => {
  const response = await api.get<ApiEnvelope<ITDashboard>>(API_ENDPOINTS.IT_ADMIN.DASHBOARD, { params });
  return unwrapApiData(response.data);
};

const getTickets = async (page = 1, limit = 20, params?: Record<string, string>) => {
  const response = await api.get<PaginatedEnvelope<ITTicket>>(API_ENDPOINTS.IT_ADMIN.TICKETS, {
    params: { page, limit, ...params },
  });
  return toPaginated(response.data);
};

const getTicket = async (id: string) => {
  const response = await api.get<ApiEnvelope<ITTicket>>(`${API_ENDPOINTS.IT_ADMIN.TICKETS}/${id}`);
  return unwrapApiData(response.data);
};

const createTicket = async (payload: Partial<ITTicket>) => {
  const response = await api.post<ApiEnvelope<ITTicket>>(API_ENDPOINTS.IT_ADMIN.TICKETS, payload);
  return unwrapApiData(response.data);
};

const updateTicket = async (id: string, payload: Partial<ITTicket>) => {
  const response = await api.patch<ApiEnvelope<ITTicket>>(`${API_ENDPOINTS.IT_ADMIN.TICKETS}/${id}`, payload);
  return unwrapApiData(response.data);
};

const addTicketComment = async (id: string, payload: { body: string; internal?: boolean }) => {
  const response = await api.post<ApiEnvelope<ITTicket>>(`${API_ENDPOINTS.IT_ADMIN.TICKETS}/${id}/comments`, payload);
  return unwrapApiData(response.data);
};

const getAssets = async (page = 1, limit = 20, params?: Record<string, string>) => {
  const response = await api.get<PaginatedEnvelope<ITAsset>>(API_ENDPOINTS.IT_ADMIN.ASSETS, {
    params: { page, limit, ...params },
  });
  return toPaginated(response.data);
};

const createAsset = async (payload: Partial<ITAsset>) => {
  const response = await api.post<ApiEnvelope<ITAsset>>(API_ENDPOINTS.IT_ADMIN.ASSETS, payload);
  return unwrapApiData(response.data);
};

const assignAsset = async (id: string, payload: { employeeId: string; userId?: string; note?: string }) => {
  const response = await api.post<ApiEnvelope<ITAsset>>(`${API_ENDPOINTS.IT_ADMIN.ASSETS}/${id}/assign`, payload);
  return unwrapApiData(response.data);
};

const returnAsset = async (id: string) => {
  const response = await api.post<ApiEnvelope<ITAsset>>(`${API_ENDPOINTS.IT_ADMIN.ASSETS}/${id}/return`, {});
  return unwrapApiData(response.data);
};

const getSetupRequests = async (page = 1, limit = 20) => {
  const response = await api.get<PaginatedEnvelope<ITSetupRequest>>(API_ENDPOINTS.IT_ADMIN.SETUP_REQUESTS, {
    params: { page, limit },
  });
  return toPaginated(response.data);
};

const createSetupRequest = async (payload: Partial<ITSetupRequest>) => {
  const response = await api.post<ApiEnvelope<ITSetupRequest>>(API_ENDPOINTS.IT_ADMIN.SETUP_REQUESTS, payload);
  return unwrapApiData(response.data);
};

const getSoftware = async (page = 1, limit = 20) => {
  const response = await api.get<PaginatedEnvelope<ITSoftwareLicence>>(API_ENDPOINTS.IT_ADMIN.SOFTWARE_LICENCES, {
    params: { page, limit },
  });
  return toPaginated(response.data);
};

const createSoftware = async (payload: Partial<ITSoftwareLicence>) => {
  const response = await api.post<ApiEnvelope<ITSoftwareLicence>>(API_ENDPOINTS.IT_ADMIN.SOFTWARE_LICENCES, payload);
  return unwrapApiData(response.data);
};

const assignSoftware = async (id: string, payload: { employeeId?: string; assetId?: string }) => {
  const response = await api.post<ApiEnvelope<ITSoftwareLicence>>(
    `${API_ENDPOINTS.IT_ADMIN.SOFTWARE_LICENCES}/${id}/assign`,
    payload,
  );
  return unwrapApiData(response.data);
};

const getConfiguration = async () => {
  const response = await api.get<ApiEnvelope<ITConfiguration[]>>(API_ENDPOINTS.IT_ADMIN.CONFIGURATION);
  return unwrapApiData(response.data);
};

const upsertConfiguration = async (payload: Pick<ITConfiguration, 'key' | 'label' | 'values'>) => {
  const response = await api.post<ApiEnvelope<ITConfiguration>>(API_ENDPOINTS.IT_ADMIN.CONFIGURATION, payload);
  return unwrapApiData(response.data);
};

export const itAdminService = {
  getDashboard,
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  addTicketComment,
  getAssets,
  createAsset,
  assignAsset,
  returnAsset,
  getSetupRequests,
  createSetupRequest,
  getSoftware,
  createSoftware,
  assignSoftware,
  getConfiguration,
  upsertConfiguration,
};
