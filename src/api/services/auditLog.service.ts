import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_CHANGE';

export interface AuditLogMetadata {
  actorEmail?: string;
  actorRole?: string | null;
  entityName?: string | null;
  message?: string;
  before?: unknown;
  after?: unknown;
}

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  entityType: string;
  entityId: string;
  action: AuditAction;
  metadata?: AuditLogMetadata;
  createdAt: string;
}

export interface AuditLogListResult {
  data: AuditLogItem[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
}

interface AuditLogEnvelope extends ApiEnvelope<AuditLogItem[]> {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  totalItems: number;
}

async function getAuditLogs(page = 1, limit = 15): Promise<AuditLogListResult> {
  const response = await api.get<AuditLogEnvelope>(API_ENDPOINTS.AUDIT_LOGS, {
    params: { page, limit },
  });

  return {
    data: unwrapApiData(response.data),
    page: response.data.page,
    limit: response.data.limit,
    totalRecords: response.data.totalRecords,
    totalPages: response.data.totalPages,
    totalItems: response.data.totalItems,
  };
}

export const auditLogService = {
  getAuditLogs,
};
