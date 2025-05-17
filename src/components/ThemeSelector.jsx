import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../context/ThemeContext';
import { FaPalette } from 'react-icons/fa';

const ThemeSelector = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-opacity-10 transition-colors"
        style={{ 
          backgroundColor: `${theme.primary}20`,
          color: theme.primary 
        }}
      >
        <FaPalette />
        <span>Theme</span>
      </button>

      <div 
        className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
        style={{ 
          backgroundColor: theme.background,
          border: `1px solid ${theme.primary}20`
        }}
      >
        <div className="py-1">
          {availableThemes.map((themeName) => (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                theme === themeName ? 'font-medium' : ''
              }`}
              style={{ 
                color: theme === themeName ? theme.primary : theme.text,
                backgroundColor: theme === themeName ? `${theme.primary}10` : 'transparent',
                ':hover': {
                  backgroundColor: `${theme.primary}20`
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: themes[themeName].dotColor }}
                />
                <span className="capitalize">{themeName}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector; 