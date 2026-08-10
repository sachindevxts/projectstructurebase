import type { ReactNode } from 'react';
import { ReusableTable, type TableColumn, type TableRowId } from '@/components/common/ReusableTable';

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRowIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  showPagination?: boolean;
  pagination?: DataTablePagination;
  pageSizeOptions?: number[];
  itemLabel?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  selectable = false,
  selectedRowIds = [],
  onSelectionChange,
  showPagination = true,
  pagination,
  pageSizeOptions = [10, 15, 25, 50],
  itemLabel = 'records',
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const tableColumns: TableColumn<T>[] = columns.map((column) => ({
    id: column.id,
    label: column.header,
    renderCell: column.render,
  }));

  return (
    <ReusableTable
      rows={data}
      columns={tableColumns}
      getRowId={(row) => String(row[rowKey])}
      onRowClick={onRowClick}
      selection={
        selectable && onSelectionChange
          ? {
              selectedRowIds,
              onSelectionChange: (ids: TableRowId[]) => onSelectionChange(ids.map(String)),
              mode: 'multiple',
            }
          : undefined
      }
      showPagination={showPagination}
      pagination={
        pagination
          ? {
              page: pagination.page - 1,
              rowsPerPage: pagination.pageSize,
              totalRows: pagination.totalItems,
              rowsPerPageOptions: pageSizeOptions,
              onPageChange: (page) => onPageChange?.(page + 1),
              onRowsPerPageChange: onPageSizeChange,
              formatResultCount: ({ from, to, total }) =>
                `Showing ${from}-${to} of ${total} ${itemLabel}`,
            }
          : undefined
      }
    />
  );
}

