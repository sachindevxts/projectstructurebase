import React, { useCallback } from 'react';
import { Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { PfPageHeader } from '@/Features/Shared/Components/PfPageHeader/PfPageHeader';
import { reportService } from '../../services/reportService';
import { useReports } from '../../hooks/useReports';
import { ReportCharts } from '../ReportCharts/ReportCharts';
import { ReportFilters } from '../ReportFilters/ReportFilters';
import { ReportStats } from '../ReportStats/ReportStats';
import styles from './ReportsPage.module.scss';

export const ReportsPage = () => {
  const { data, stats, filters, loading, error, updateFilter, resetFilters } = useReports();

  const handleExport = useCallback(() => {
    const csv = reportService.exportSummary(data);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'peopleflow-report-summary.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <Box className={styles.page}>
      <PfPageHeader title="Reports" subtitle="Analyze utilization, bench, allocation mix, and workforce trends.">
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>Export</Button>
      </PfPageHeader>

      <ReportStats stats={stats} />

      <Paper elevation={0} className={styles.filtersWrapper}>
        <ReportFilters filters={filters} onFilterChange={updateFilter} onReset={resetFilters} />
      </Paper>

      {loading ? (
        <Paper className={styles.state}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>Loading reports...</Typography>
        </Paper>
      ) : error ? (
        <Paper className={styles.state}>
          <Typography variant="body2" color="error">{error}</Typography>
        </Paper>
      ) : (
        <ReportCharts data={data} />
      )}
    </Box>
  );
};

export default ReportsPage;
