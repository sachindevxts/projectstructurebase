import React, { useMemo } from 'react';
import { Avatar, Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { PLANNER_STATUS_COLORS } from '../../constants/planner.constants';
import type { PlannerAllocation } from '../../types/planner.types';
import styles from './PlannerTimeline.module.scss';

interface PlannerTimelineProps {
  allocations: PlannerAllocation[];
  loading?: boolean;
}

interface EmployeeLane {
  employeeId: string;
  employee: string;
  role: string;
  allocationTotal: number;
  status: PlannerAllocation['status'];
  allocations: PlannerAllocation[];
}

const days = Array.from({ length: 30 }, (_, index) => index + 2);
const dayWidth = 56;
const today = 15;

const getOffset = (date: string) => {
  const day = new Date(`${date}T00:00:00`).getDate();
  return Math.max(0, Math.min(days.length - 1, day - 2)) * dayWidth;
};

const getWidth = (startDate: string, endDate: string) => {
  const startDay = new Date(`${startDate}T00:00:00`).getDate();
  const endDay = new Date(`${endDate}T00:00:00`).getDate();
  const visibleStart = Math.max(2, startDay);
  const visibleEnd = Math.min(31, endDay);
  return Math.max(dayWidth * 2, (visibleEnd - visibleStart + 1) * dayWidth - 8);
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

const legendItems = [
  { label: 'Billable', status: 'Billable' },
  { label: 'Non-Billable', status: 'Non-Billable' },
  { label: 'Overallocated', status: 'Overallocated' },
  { label: 'Fully Allocated', status: 'Fully Allocated' },
  { label: 'Releasing Soon', status: 'Releasing Soon' },
  { label: 'Bench', status: 'Bench' },
];

export const PlannerTimeline = ({ allocations, loading = false }: PlannerTimelineProps) => {
  const lanes = useMemo(() => {
    const laneMap = new Map<string, EmployeeLane>();

    allocations.forEach((allocation) => {
      const existing = laneMap.get(allocation.employeeId);
      const nextAllocations = [...(existing?.allocations ?? []), allocation];
      const allocationTotal = nextAllocations.reduce((sum, item) => sum + item.allocation, 0);
      const status =
        nextAllocations.find((item) => item.status === 'Overallocated')?.status ??
        nextAllocations.find((item) => item.status === 'Bench')?.status ??
        nextAllocations.find((item) => item.status === 'Releasing Soon')?.status ??
        (allocationTotal >= 100 ? 'Fully Allocated' : allocation.status);

      laneMap.set(allocation.employeeId, {
        employeeId: allocation.employeeId,
        employee: allocation.employee,
        role: allocation.role,
        allocationTotal,
        status,
        allocations: nextAllocations,
      });
    });

    return Array.from(laneMap.values());
  }, [allocations]);

  if (loading) {
    return (
      <Paper className={styles.state}>
        <CircularProgress size={40} />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          Loading planner...
        </Typography>
      </Paper>
    );
  }

  if (!lanes.length) {
    return (
      <Paper className={styles.state}>
        <Typography variant="h6">No Allocations Found</Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting the planner filters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box className={styles.timeline}>
      <Box className={styles.legendBar}>
        <Box className={styles.legendItems}>
          <Typography variant="caption" className={styles.legendLabel}>
            Legend:
          </Typography>
          {legendItems.map((item) => (
            <Box key={item.status} className={styles.legendItem}>
              <Box className={styles.legendSwatch} sx={{ backgroundColor: PLANNER_STATUS_COLORS[item.status] }} />
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          ))}
        </Box>
        <Typography variant="caption" className={styles.todayLegend}>
          Today (Jul 15)
        </Typography>
      </Box>

      <Box className={styles.gridFrame}>
        <Box className={styles.employeeHeader}>Employee</Box>
        <Box className={styles.calendarHeader}>
          <Box className={styles.dateGrid} style={{ width: days.length * dayWidth }}>
            {days.map((day) => (
              <Box key={day} className={`${styles.dayCell} ${day === today ? styles.todayDate : ''}`}>
                {day === 15 ? '→T' : day}
              </Box>
            ))}
            <Box className={styles.monthHint}>Aug →</Box>
          </Box>
        </Box>

        <Box className={styles.employeeColumn}>
          {lanes.map((lane) => {
            const statusColor = PLANNER_STATUS_COLORS[lane.status] ?? 'var(--color-text-muted)';
            return (
              <Box key={lane.employeeId} className={`${styles.employeeLane} ${lane.status === 'Overallocated' ? styles.overallocatedLane : ''}`}>
                <Avatar className={styles.avatar}>{getInitials(lane.employee)}</Avatar>
                <Box className={styles.employeeMeta}>
                  <Typography variant="body2" className={styles.employeeName}>
                    {lane.employee}
                  </Typography>
                  <Typography variant="caption" className={styles.employeeRole}>
                    {lane.role}
                  </Typography>
                  <Chip
                    label={lane.status === 'Bench' ? 'Bench' : `${lane.allocationTotal}%`}
                    size="small"
                    className={styles.capacityChip}
                    sx={{
                      backgroundColor: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
                      color: lane.status === 'Bench' ? 'var(--color-text-muted)' : statusColor,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box className={styles.timelineScroll}>
          <Box className={styles.timelineCanvas} style={{ width: days.length * dayWidth }}>
            <Box className={styles.todayLine} style={{ left: getOffset('2025-07-15') + dayWidth / 2 }} />
            {days.map((day) => (
              <Box key={day} className={styles.columnLine} style={{ left: (day - 2) * dayWidth }} />
            ))}
            {lanes.map((lane) => (
              <Box key={lane.employeeId} className={`${styles.timelineLane} ${lane.status === 'Overallocated' ? styles.overallocatedLane : ''}`}>
                {lane.allocations.map((allocation, index) => {
                  const statusColor = PLANNER_STATUS_COLORS[allocation.status] ?? 'var(--color-text-muted)';
                  const isBench = allocation.status === 'Bench';
                  return (
                    <Box
                      key={allocation.id}
                      className={`${styles.allocationBar} ${isBench ? styles.benchBar : ''}`}
                      style={{
                        left: getOffset(allocation.startDate),
                        top: 10 + index * 32,
                        width: getWidth(allocation.startDate, allocation.endDate),
                        backgroundColor: statusColor,
                      color: isBench ? 'var(--color-text-secondary)' : 'var(--color-on-primary)',
                      }}
                    >
                      {allocation.project} · {allocation.status === 'Bench' ? 'Bench 68 days' : `${allocation.allocation}%`}
                      {allocation.status === 'Releasing Soon' ? ' — Ends Aug 1' : ''}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

