import React, { useMemo } from 'react';
import {
  Box,
  Checkbox,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import type {
  ReusableTableProps,
  SortDirection,
  TableColumn,
  TableFilterValue,
  TableRowId,
} from './ReusableTable.types';
import styles from './ReusableTable.module.scss';

const getCellValue = <T,>(row: T, column: TableColumn<T>) => {
  if (column.renderCell) {
    return column.renderCell(row);
  }

  if (column.field) {
    const value = row[column.field];
    return value == null ? '' : String(value);
  }

  return null;
};

const getNextDirection = (current?: SortDirection): SortDirection =>
  current === 'asc' ? 'desc' : 'asc';

const formatDefaultResultCount = ({ from, to, total }: { from: number; to: number; total: number }) =>
  total > 0 ? `${from}-${to} of ${total}` : '0 of 0';

const asTextValue = (value: TableFilterValue): string => {
  if (Array.isArray(value)) return value.map(String).join(', ');
  if (value == null) return '';
  return String(value);
};

const asSingleSelectValue = (value: TableFilterValue): string => {
  if (Array.isArray(value)) return value[0] == null ? '' : String(value[0]);
  if (value == null) return '';
  return String(value);
};

const asMultiSelectValue = (value: TableFilterValue): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value == null || value === '') return [];
  return [String(value)];
};

const renderFilterControl = (column: TableColumn<unknown>) => {
  const filter = column.filter;

  if (!filter) {
    return null;
  }

  if (filter.type === 'custom') {
    return filter.renderFilter?.() ?? null;
  }

  if (filter.type === 'select' || filter.type === 'boolean') {
    return (
      <Select
        size="small"
        fullWidth
        displayEmpty
        value={asSingleSelectValue(filter.value)}
        className={styles.filterControl}
        onChange={(event: SelectChangeEvent<string>) => filter.onChange?.(event.target.value)}
        aria-label={filter.label ?? `${String(column.label)} filter`}
      >
        <MenuItem value="">{filter.placeholder ?? 'All'}</MenuItem>
        {filter.options?.map((option) => (
          <MenuItem key={option.value} value={String(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  if (filter.type === 'multi-select') {
    return (
      <Select
        size="small"
        fullWidth
        multiple
        value={asMultiSelectValue(filter.value)}
        className={styles.filterControl}
        onChange={(event: SelectChangeEvent<string[]>) => {
          const value = event.target.value;
          filter.onChange?.(typeof value === 'string' ? value.split(',') : value);
        }}
        aria-label={filter.label ?? `${String(column.label)} filter`}
      >
        {filter.options?.map((option) => (
          <MenuItem key={option.value} value={String(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    );
  }

  return (
    <TextField
      size="small"
      fullWidth
      type={filter.type === 'date' ? 'date' : 'text'}
      value={asTextValue(filter.value)}
      placeholder={filter.placeholder}
      onChange={(event) => filter.onChange?.(event.target.value)}
      aria-label={filter.label ?? `${String(column.label)} filter`}
    />
  );
};

export const ReusableTable = <T,>({
  rows,
  columns,
  getRowId,
  loading = false,
  emptyState,
  toolbar,
  pagination,
  showPagination = Boolean(pagination),
  sortModel,
  onSortChange,
  filters,
  selection,
  visibleColumns,
  onRowClick,
}: ReusableTableProps<T>) => {
  const visibleTableColumns = useMemo(
    () =>
      columns.filter(
        (column) => !column.hidden && (visibleColumns ? visibleColumns[column.id] !== false : true),
      ),
    [columns, visibleColumns],
  );

  const hasColumnFilters = visibleTableColumns.some((column) => column.filter);
  const selectedIds = selection?.selectedRowIds ?? [];
  const rowIds = rows.map(getRowId);
  const selectableRowIds = selection
    ? rows.filter((row) => selection.isRowSelectable?.(row) ?? true).map(getRowId)
    : [];
  const allSelected =
    selectableRowIds.length > 0 && selectableRowIds.every((id) => selectedIds.includes(id));
  const someSelected = selectableRowIds.some((id) => selectedIds.includes(id));
  const columnCount = visibleTableColumns.length + (selection ? 1 : 0);
  const from = pagination && pagination.totalRows > 0 ? pagination.page * pagination.rowsPerPage + 1 : 0;
  const to = pagination
    ? Math.min((pagination.page + 1) * pagination.rowsPerPage, pagination.totalRows)
    : rows.length;
  const resultText =
    pagination?.formatResultCount?.({ from, to, total: pagination.totalRows }) ??
    formatDefaultResultCount({ from, to, total: pagination?.totalRows ?? rows.length });
  const pageCount = pagination ? Math.max(1, Math.ceil(pagination.totalRows / pagination.rowsPerPage)) : 1;

  const updateSelection = (ids: TableRowId[]) => {
    selection?.onSelectionChange(ids);
  };

  const toggleAll = () => {
    if (!selection) return;
    const remaining = selectedIds.filter((id) => !selectableRowIds.includes(id));
    updateSelection(allSelected ? remaining : [...remaining, ...selectableRowIds]);
  };

  const toggleRow = (row: T) => {
    if (!selection) return;
    const id = getRowId(row);
    const selected = selectedIds.includes(id);

    if (selection.mode === 'single') {
      updateSelection(selected ? [] : [id]);
      return;
    }

    updateSelection(selected ? selectedIds.filter((value) => value !== id) : [...selectedIds, id]);
  };

  return (
    <Paper elevation={0} className={styles.container}>
      {toolbar}
      {filters}
      <TableContainer className={styles.tableScroller}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              {selection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    size="small"
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    onChange={toggleAll}
                    inputProps={{ 'aria-label': selection.ariaLabel ?? 'Select all visible rows' }}
                  />
                </TableCell>
              )}
              {visibleTableColumns.map((column) => {
                const active = sortModel?.columnId === column.id;
                const direction = active ? sortModel.direction : 'asc';

                return (
                  <TableCell
                    key={column.id}
                    align={column.align}
                  >
                    {column.sortable && onSortChange ? (
                      <TableSortLabel
                        active={active}
                        direction={direction}
                        onClick={() =>
                          onSortChange({
                            columnId: column.id,
                            direction: active ? getNextDirection(sortModel?.direction) : 'asc',
                          })
                        }
                      >
                        {column.renderHeader?.() ?? column.label}
                      </TableSortLabel>
                    ) : (
                      column.renderHeader?.() ?? column.label
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
            {hasColumnFilters && (
              <TableRow className={styles.filtersRow}>
                {selection && <TableCell padding="checkbox" />}
                {visibleTableColumns.map((column) => (
                  <TableCell key={`${column.id}-filter`} align={column.align}>
                    {renderFilterControl(column as TableColumn<unknown>)}
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {Array.from({ length: columnCount }).map((__, cellIndex) => (
                    <TableCell key={`loading-${rowIndex}-${cellIndex}`}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className={styles.emptyCell}>
                  {emptyState?.content ?? (
                    <Box className={styles.emptyContent} role="status">
                      {emptyState?.icon}
                      <Typography className={styles.emptyTitle}>
                        {emptyState?.title ?? 'No records found'}
                      </Typography>
                      {emptyState?.description && (
                        <Typography variant="body2" className={styles.emptyDescription}>
                          {emptyState.description}
                        </Typography>
                      )}
                      {emptyState?.action}
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              rows.map((row, index) => {
                const id = rowIds[index];
                const selectable = selection?.isRowSelectable?.(row) ?? true;

                return (
                  <TableRow key={id} hover onClick={() => onRowClick?.(row)}>
                    {selection && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          size="small"
                          checked={selectedIds.includes(id)}
                          disabled={!selectable}
                          onChange={() => toggleRow(row)}
                          inputProps={{ 'aria-label': `Select row ${id}` }}
                        />
                      </TableCell>
                    )}
                    {visibleTableColumns.map((column) => (
                      <TableCell key={`${id}-${column.id}`} align={column.align}>
                        {getCellValue(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {showPagination && pagination && (
        <Box className={styles.footer}>
          <Typography variant="body2" className={styles.resultText}>
            {resultText}
          </Typography>
          <Stack direction="row" spacing={1.5} alignItems="center" className={styles.paginationActions}>
            <Pagination
              count={pageCount}
              page={pagination.page + 1}
              color="primary"
              size="small"
              siblingCount={1}
              boundaryCount={1}
              onChange={(_, page) => pagination.onPageChange?.(page - 1)}
            />
            {pagination.showRowsPerPage !== false && (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2">{pagination.labelRowsPerPage ?? 'Rows:'}</Typography>
                <Select
                  size="small"
                  value={String(pagination.rowsPerPage)}
                  className={styles.rowsSelect}
                  onChange={(event) => pagination.onRowsPerPageChange?.(Number(event.target.value))}
                >
                  {(pagination.rowsPerPageOptions ?? [10, 25, 50]).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            )}
          </Stack>
        </Box>
      )}
    </Paper>
  );
};

export type {
  ReusableTableProps,
  TableColumn,
  TableEmptyState,
  TableFilterConfig,
  TablePaginationConfig,
  TableRowId,
  TableSelectionConfig,
  TableSortModel,
} from './ReusableTable.types';
