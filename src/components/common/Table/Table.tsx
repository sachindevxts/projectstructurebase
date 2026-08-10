import type { TableProps } from './Table.types';
import { ReusableTable, type TableColumn } from '../ReusableTable';

export function Table<T>({
  columns,
  data,
  loading,
  emptyMessage = 'No data',
  rowKey = 'id',
}: TableProps<T>) {
  const tableColumns: TableColumn<T>[] = columns.map((column) => ({
    id: column.key,
    label: column.title,
    sortable: column.sortable,
    renderCell: (row) => {
      if (column.render) {
        return column.render(row);
      }

      const value = row[column.key as keyof T];
      return value == null ? '' : String(value);
    },
  }));

  return (
    <ReusableTable
      rows={data ?? []}
      columns={tableColumns}
      getRowId={(row) => String(row[rowKey as keyof T])}
      loading={loading}
      emptyState={{ title: emptyMessage }}
    />
  );
}

export default Table;

