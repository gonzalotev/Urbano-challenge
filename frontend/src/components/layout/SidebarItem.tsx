import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className={`btn flex items-center gap-2 w-full sm:w-auto justify-between no-underline text-black ${
        active ? 'bg-gray-200' : ''
      }`}
    >
      <div className="flex-shrink-0 text-2xl">{children[0]}</div>
      <span className="flex-grow text-center font-semibold">{children[1]}</span>
      {active ? <ChevronRight className="text-lg" /> : <div className="w-6" />}
    </Link>
  );
}
