import React, { useMemo } from 'react';
import { Avatar, Box, Chip, CircularProgress, Paper, Typography } from '@mui/material';
import { PLANNER_STATUS_COLORS } from '../../constants/planner.constants';
import type {
  PlannerAllocation,
  PlannerGroupBy,
  PlannerRange,
  PlannerViewMode,
} from '../../types/planner.types';
import styles from './PlannerTimeline.module.scss';

interface PlannerTimelineProps {
  allocations: PlannerAllocation[];
  loading?: boolean;
  viewMode: PlannerViewMode;
  groupBy: PlannerGroupBy;
  visibleRange: PlannerRange;
}

interface TimelineLane {
  id: string;
  title: string;
  subtitle: string;
  allocationTotal: number;
  status: PlannerAllocation['status'];
  allocations: PlannerAllocation[];
}

const dayWidth = 56;
const msPerDay = 24 * 60 * 60 * 1000;

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const legendItems = [
  { label: 'Billable', status: 'Billable' },
  { label: 'Non-Billable', status: 'Non-Billable' },
  { label: 'Overallocated', status: 'Overallocated' },
  { label: 'Fully Allocated', status: 'Fully Allocated' },
  { label: 'Releasing Soon', status: 'Releasing Soon' },
  { label: 'Bench', status: 'Bench' },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

const getDateCells = (range: PlannerRange) => {
  const start = new Date(`${range.startDate}T00:00:00`);
  const end = new Date(`${range.endDate}T00:00:00`);
  const count = Math.max(1, Math.round((end.getTime() - start.getTime()) / msPerDay) + 1);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const value = toDateKey(date);
    return {
      value,
      label: String(date.getDate()),
    };
  });
};

const getOffset = (date: string, range: PlannerRange) => {
  const rangeStart = new Date(`${range.startDate}T00:00:00`).getTime();
  const value = new Date(`${date}T00:00:00`).getTime();
  return Math.max(0, Math.round((value - rangeStart) / msPerDay)) * dayWidth;
};

const getWidth = (startDate: string, endDate: string, range: PlannerRange) => {
  const visibleStart = Math.max(
    new Date(`${startDate}T00:00:00`).getTime(),
    new Date(`${range.startDate}T00:00:00`).getTime(),
  );
  const visibleEnd = Math.min(
    new Date(`${endDate}T00:00:00`).getTime(),
    new Date(`${range.endDate}T00:00:00`).getTime(),
  );
  const days = Math.max(1, Math.round((visibleEnd - visibleStart) / msPerDay) + 1);
  return Math.max(dayWidth, days * dayWidth - 8);
};

const getLaneStatus = (allocations: PlannerAllocation[]) => {
  const total = allocations.reduce((sum, item) => sum + item.allocation, 0);
  return (
    allocations.find((item) => item.status === 'Overallocated')?.status ??
    allocations.find((item) => item.status === 'Bench')?.status ??
    allocations.find((item) => item.status === 'Releasing Soon')?.status ??
    (total >= 100 ? 'Fully Allocated' : allocations[0]?.status ?? 'Bench')
  );
};

export const PlannerTimeline = ({
  allocations,
  loading = false,
  viewMode,
  groupBy,
  visibleRange,
}: PlannerTimelineProps) => {
  const dateCells = useMemo(() => getDateCells(visibleRange), [visibleRange]);
  const todayValue = toDateKey(new Date());
  const canvasWidth = dateCells.length * dayWidth;

  const lanes = useMemo(() => {
    const laneMap = new Map<string, PlannerAllocation[]>();

    allocations.forEach((allocation) => {
      const key = groupBy === 'project' ? allocation.project : allocation.employeeId;
      laneMap.set(key, [...(laneMap.get(key) ?? []), allocation]);
    });

    return Array.from(laneMap.entries()).map(([key, items]): TimelineLane => {
      const allocationTotal = items.reduce((sum, item) => sum + item.allocation, 0);
      return {
        id: key,
        title: groupBy === 'project' ? items[0].project : items[0].employee,
        subtitle: groupBy === 'project' ? `${items.length} allocations` : items[0].role,
        allocationTotal,
        status: getLaneStatus(items),
        allocations: items,
      };
    });
  }, [allocations, groupBy]);

  const heatmapRows = useMemo(() => {
    const rowMap = new Map<string, Record<string, number>>();

    allocations.forEach((allocation) => {
      const values = rowMap.get(allocation.project) ?? {};
      dateCells.forEach((cell) => {
        if (allocation.startDate <= cell.value && allocation.endDate >= cell.value) {
          values[cell.value] = (values[cell.value] ?? 0) + allocation.allocation;
        }
      });
      rowMap.set(allocation.project, values);
    });

    return Array.from(rowMap.entries()).map(([project, values]) => ({ project, values }));
  }, [allocations, dateCells]);

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

  if (!allocations.length) {
    return (
      <Paper className={styles.state}>
        <Typography variant="h6">No Allocations Found</Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting the planner filters or date range.
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
          {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view
        </Typography>
      </Box>

      <Box className={styles.gridFrame}>
        <Box className={styles.employeeHeader}>{groupBy === 'project' || groupBy === 'heatmap' ? 'Project' : 'Employee'}</Box>
        <Box className={styles.calendarHeader}>
          <Box
            className={styles.dateGrid}
            style={{ width: canvasWidth, gridTemplateColumns: `repeat(${dateCells.length}, ${dayWidth}px)` }}
          >
            {dateCells.map((cell) => (
              <Box key={cell.value} className={`${styles.dayCell} ${cell.value === todayValue ? styles.todayDate : ''}`}>
                {cell.value === todayValue ? 'Today' : cell.label}
              </Box>
            ))}
          </Box>
        </Box>

        <Box className={styles.employeeColumn}>
          {(groupBy === 'heatmap' ? heatmapRows : lanes).map((lane) => {
            const title = 'project' in lane ? lane.project : lane.title;
            const subtitle = 'project' in lane ? 'Daily allocation load' : lane.subtitle;
            const status = 'project' in lane ? 'Billable' : lane.status;
            const total = 'project' in lane ? undefined : lane.allocationTotal;
            const statusColor = PLANNER_STATUS_COLORS[status] ?? 'var(--color-text-muted)';

            return (
              <Box key={title} className={`${styles.employeeLane} ${status === 'Overallocated' ? styles.overallocatedLane : ''}`}>
                <Avatar className={styles.avatar}>{getInitials(title)}</Avatar>
                <Box className={styles.employeeMeta}>
                  <Typography variant="body2" className={styles.employeeName}>
                    {title}
                  </Typography>
                  <Typography variant="caption" className={styles.employeeRole}>
                    {subtitle}
                  </Typography>
                  {typeof total === 'number' && (
                    <Chip
                      label={`${total}%`}
                      size="small"
                      className={styles.capacityChip}
                      sx={{
                        backgroundColor: `color-mix(in srgb, ${statusColor} 14%, transparent)`,
                        color: statusColor,
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box className={styles.timelineScroll}>
          <Box className={styles.timelineCanvas} style={{ width: canvasWidth }}>
            {todayValue >= visibleRange.startDate && todayValue <= visibleRange.endDate && (
              <Box className={styles.todayLine} style={{ left: getOffset(todayValue, visibleRange) + dayWidth / 2 }} />
            )}
            {dateCells.map((cell, index) => (
              <Box key={cell.value} className={styles.columnLine} style={{ left: index * dayWidth }} />
            ))}

            {groupBy === 'heatmap'
              ? heatmapRows.map((row) => (
                  <Box key={row.project} className={styles.timelineLane}>
                    {dateCells.map((cell) => {
                      const value = row.values[cell.value] ?? 0;
                      const color =
                        value > 100
                          ? 'var(--color-error)'
                          : value === 100
                            ? 'var(--color-success)'
                            : value > 0
                              ? 'var(--color-primary)'
                              : 'var(--color-border)';

                      return (
                        <Box
                          key={`${row.project}-${cell.value}`}
                          className={styles.heatCell}
                          style={{ left: getOffset(cell.value, visibleRange), backgroundColor: color }}
                        >
                          {value || ''}
                        </Box>
                      );
                    })}
                  </Box>
                ))
              : lanes.map((lane) => (
                  <Box key={lane.id} className={`${styles.timelineLane} ${lane.status === 'Overallocated' ? styles.overallocatedLane : ''}`}>
                    {lane.allocations.map((allocation, index) => {
                      const statusColor = PLANNER_STATUS_COLORS[allocation.status] ?? 'var(--color-text-muted)';
                      const isBench = allocation.status === 'Bench';
                      return (
                        <Box
                          key={allocation.id}
                          className={`${styles.allocationBar} ${isBench ? styles.benchBar : ''}`}
                          style={{
                            left: getOffset(allocation.startDate, visibleRange),
                            top: 10 + index * 32,
                            width: getWidth(allocation.startDate, allocation.endDate, visibleRange),
                            backgroundColor: statusColor,
                            color: isBench ? 'var(--color-text-secondary)' : 'var(--color-on-primary)',
                          }}
                        >
                          {groupBy === 'project' ? allocation.employee : allocation.project} - {allocation.allocation}%
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
