import { ReactNode } from 'react';

import TableHeaderItem from './TableHeaderItem';

interface TableProps {
  columns: string[];
  children: ReactNode;
  orderBy: string;
  order: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function Table({
  columns,
  children,
  orderBy,
  order,
  onSort,
}: TableProps) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="dark:text-white">
        <tr>
          {columns.map((column, index) => (
            <TableHeaderItem
              key={index}
              field={column.toLowerCase()}
              orderBy={orderBy}
              order={order}
              onSort={onSort}
            >
              {column}
            </TableHeaderItem>
          ))}
          <th scope="col" className="relative px-6 py-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">{children}</tbody>
    </table>
  );
}
