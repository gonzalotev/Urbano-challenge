import React from 'react';
import { Moon, Sun } from 'react-feather';

import { useTheme } from '../../context/ThemeContext';

const ThemeButton: React.FC = () => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <button
      className="btn flex items-center gap-2"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? (
        <Sun className="text-yellow-500" />
      ) : (
        <Moon className="text-gray-800" />
      )}
    </button>
  );
};

export default ThemeButton;
