import type { ReactNode } from 'react';

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  minWidth?: number;
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
  const visibleIds = data.map((row) => String(row[rowKey]));
  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedRowIds.includes(id));
  const toggleAll = () => {
    const remaining = selectedRowIds.filter((id) => !visibleIds.includes(id));
    onSelectionChange?.(allSelected ? remaining : [...remaining, ...visibleIds]);
  };
  const toggleRow = (id: string) =>
    onSelectionChange?.(
      selectedRowIds.includes(id)
        ? selectedRowIds.filter((value) => value !== id)
        : [...selectedRowIds, id],
    );
  const firstItem = pagination?.totalItems ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
  const lastItem = pagination
    ? Math.min(pagination.page * pagination.pageSize, pagination.totalItems)
    : 0;
  const pages = pagination
    ? Array.from({ length: pagination.totalPages }, (_, index) => index + 1).filter(
        (value) =>
          value === 1 || value === pagination.totalPages || Math.abs(value - pagination.page) <= 1,
      )
    : [];

  return (
    <div className="pf-data-table">
      <div className="pf-table-wrap">
        <table className="pf-table">
          <thead>
            <tr>
              {selectable && (
                <th className="pf-table__selection">
                  <input
                    type="checkbox"
                    aria-label="Select all visible rows"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'is-clickable' : undefined}
              >
                {selectable && (
                  <td className="pf-table__selection" onClick={(event) => event.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Select row ${String(row[rowKey])}`}
                      checked={selectedRowIds.includes(String(row[rowKey]))}
                      onChange={() => toggleRow(String(row[rowKey]))}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && pagination && (
        <footer className="data-table-pagination">
          <p>
            Showing{' '}
            <strong>
              {firstItem}–{lastItem}
            </strong>{' '}
            of <strong>{pagination.totalItems}</strong> {itemLabel}
          </p>
             <label>
            Rows:
            <select
              value={pagination.pageSize}
              onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <nav aria-label="Table pagination">
            <button
              type="button"
              aria-label="Previous page"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
            >
              ‹
            </button>
            {pages.map((page, index) => (
              <span key={page} className="data-table-pagination__page-item">
                {index > 0 && page - pages[index - 1] > 1 && <i>…</i>}
                <button
                  type="button"
                  aria-current={page === pagination.page ? 'page' : undefined}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </button>
              </span>
            ))}
            <button
              type="button"
              aria-label="Next page"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
            >
              ›
            </button>
          </nav>
       
        </footer>
      )}
    </div>
  );
}
