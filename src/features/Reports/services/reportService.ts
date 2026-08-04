import reportData from '@/dummyJson/reports/report-list.json';
import type { ReportData, ReportFilters } from '../types/report.types';

class ReportService {
  private reports: ReportData = reportData as ReportData;

  getReportData(filters?: ReportFilters): ReportData {
    if (!filters || filters.department === 'All') return this.reports;

    return {
      ...this.reports,
      departmentUtilization: this.reports.departmentUtilization.filter((item) => item.department === filters.department),
    };
  }

  exportSummary(data: ReportData): string {
    const rows = [
      ['Metric', 'Value'],
      ['Headcount', data.metrics.headcount],
      ['Billable', data.metrics.billable],
      ['Bench', data.metrics.bench],
      ['Utilization', `${data.metrics.utilization}%`],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}

export const reportService = new ReportService();
