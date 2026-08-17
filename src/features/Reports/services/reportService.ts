import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';
import type { ReportData, ReportFilters } from '../types/report.types';

let reports: ReportData = {
  metrics: { headcount: 0, billable: 0, bench: 0, utilization: 0 },
  departmentUtilization: [],
  monthlyTrend: [],
  allocationMix: [],
};

async function getReportData(filters?: ReportFilters): Promise<ReportData> {
  const response = await api.get<ApiEnvelope<ReportData>>(API_ENDPOINTS.REPORTS.WORKFORCE, {
    params: {
      department: filters?.department,
      period: filters?.period,
      reportType: filters?.reportType,
    },
  });
  reports = unwrapApiData(response.data);
  return reports;
}

function exportSummary(data: ReportData): string {
  const rows = [
    ['Metric', 'Value'],
    ['Headcount', data.metrics.headcount],
    ['Billable', data.metrics.billable],
    ['Bench', data.metrics.bench],
    ['Utilization', `${data.metrics.utilization}%`],
  ];

  return rows.map((row) => row.join(',')).join('\n');
}

export const reportService = {
  getReportData,
  exportSummary,
};
