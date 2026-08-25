import {
  unwrapPaginatedApiData,
  type PaginatedEnvelope,
} from '@/api/apiResponse';
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

async function getAuditLogs(page = 1, limit = 15): Promise<AuditLogListResult> {
  const response = await api.get<PaginatedEnvelope<AuditLogItem>>(API_ENDPOINTS.AUDIT_LOGS, {
    params: { page, limit },
  });
  const result = unwrapPaginatedApiData(response.data);

  return {
    data: result.data,
    ...result.pagination,
  };
}

export const auditLogService = {
  getAuditLogs,
};
