import { ReactNode } from 'react';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';

interface TableHeaderItemProps {
  children: ReactNode;
  field: string;
  orderBy: string;
  order: 'asc' | 'desc';
  onSort: (field: string) => void;
}

export default function TableHeaderItem({
  children,
  field,
  orderBy,
  order,
  onSort,
}: TableHeaderItemProps) {
  const [currentOrder, setCurrentOrder] = useState<'asc' | 'desc'>(order);

  const isSorted = orderBy === field;
  const isAscending = currentOrder === 'asc';

  const handleClick = () => {
    const newOrder = isSorted
      ? currentOrder === 'asc'
        ? 'desc'
        : 'asc'
      : 'asc';
    setCurrentOrder(newOrder);
    onSort(field);
  };

  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center">
        {children}
        {isSorted && (
          <span className="ml-1">
            {isAscending ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        )}
      </div>
    </th>
  );
}
