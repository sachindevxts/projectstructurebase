import type { ReactNode } from 'react';

export type TableRowId = string | number;

export type SortDirection = 'asc' | 'desc';

export interface TableSortModel {
  columnId: string;
  direction: SortDirection;
}

export type TableFilterValue = string | number | boolean | Array<string | number> | null;

export interface TableFilterOption {
  label: string;
  value: string | number;
}

export interface TableFilterConfig {
  type: 'text' | 'select' | 'multi-select' | 'date' | 'boolean' | 'custom';
  value: TableFilterValue;
  options?: TableFilterOption[];
  onChange?: (value: TableFilterValue) => void;
  renderFilter?: () => ReactNode;
  placeholder?: string;
  label?: string;
}

export interface TableColumn<T> {
  id: string;
  width?: number | string;
  label: ReactNode;
  field?: keyof T;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  renderCell?: (row: T) => ReactNode;
  renderHeader?: () => ReactNode;
  filter?: TableFilterConfig;
}

export interface TableEmptyState {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  content?: ReactNode;
}

export interface TablePaginationConfig {
  page: number;
  rowsPerPage: number;
  totalRows: number;
  rowsPerPageOptions?: number[];
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  showRowsPerPage?: boolean;
  labelRowsPerPage?: string;
  formatResultCount?: (params: { from: number; to: number; total: number }) => string;
}

export interface TableSelectionConfig<T> {
  selectedRowIds: TableRowId[];
  onSelectionChange: (ids: TableRowId[]) => void;
  mode?: 'single' | 'multiple';
  isRowSelectable?: (row: T) => boolean;
  ariaLabel?: string;
}

export interface ReusableTableProps<T> {
  rows: T[];
  columns: TableColumn<T>[];
  getRowId: (row: T) => TableRowId;
  loading?: boolean;
  emptyState?: TableEmptyState;
  toolbar?: ReactNode;
  pagination?: TablePaginationConfig;
  showPagination?: boolean;
  sortModel?: TableSortModel;
  onSortChange?: (model: TableSortModel) => void;
  sortingMode?: 'client' | 'server';
  filters?: ReactNode;
  selection?: TableSelectionConfig<T>;
  visibleColumns?: Record<string, boolean>;
  onRowClick?: (row: T) => void;
}
