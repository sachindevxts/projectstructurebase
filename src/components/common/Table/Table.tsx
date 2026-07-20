import React from 'react';
import type { TableProps } from './Table.types';
import './Table.scss';
import { CardSkeleton } from '../Skeleton/CardSkeleton';

export function Table<T>({
  columns,
  data,
  loading,
  emptyMessage = 'No data',
  rowKey = 'id',
  ...rest
}: TableProps<T>) {
  if (loading) return <CardSkeleton />;
  if (!data || data.length === 0) return <div className="table--empty">{emptyMessage}</div>;

  return (
    <table className="table" {...rest}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: any) => (
          <tr key={row[rowKey]}>
            {columns.map((col) => (
              <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
