import { BookOpen, Home, LogOut, User, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import { useTheme } from './../../context/ThemeContext';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const history = useHistory();
  const { authenticatedUser, setAuthenticatedUser } = useAuth();
  const { darkMode } = useTheme();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div
      className={`sidebar ${className}`}
      style={{
        backgroundImage: 'url(/sidemenu-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Link to="/" className="no-underline text-black">
        <img
          src={darkMode ? '/urbano-logo-white.png' : '/urbano-logo-black.png'}
          alt="Carna Project Logo"
          className="mx-auto h-12 w-auto"
        />
      </Link>
      <nav className="mt-20 flex flex-col gap-2 flex-grow">
        <SidebarItem to="/">
          <Home /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen /> Courses
        </SidebarItem>
        <SidebarItem to="/perfil">
          <User /> Perfil
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-red-500 rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none mt-5"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
