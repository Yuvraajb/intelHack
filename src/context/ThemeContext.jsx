import React, { createContext, useState, useContext } from 'react';

export const themes = {
  ocean: {
    primary: '#3b82f6', // blue-500
    secondary: '#60a5fa', // blue-400
    accent: '#93c5fd', // blue-300
    background: '#f0f9ff', // blue-50
    backgroundAlt: '#e0f2fe', // blue-100
    text: '#1e3a8a', // blue-900
    textLight: '#3b82f6', // blue-500
    border: '#bfdbfe', // blue-200
    dotColor: '#3b82f6', // blue-500
  },
  forest: {
    primary: '#059669', // emerald-600
    secondary: '#10b981', // emerald-500
    accent: '#34d399', // emerald-400
    background: '#ecfdf5', // emerald-50
    backgroundAlt: '#d1fae5', // emerald-100
    text: '#064e3b', // emerald-900
    textLight: '#059669', // emerald-600
    border: '#a7f3d0', // emerald-200
    dotColor: '#059669', // emerald-600
  },
  sunset: {
    primary: '#f97316', // orange-500
    secondary: '#fb923c', // orange-400
    accent: '#fdba74', // orange-300
    background: '#fff7ed', // orange-50
    backgroundAlt: '#ffedd5', // orange-100
    text: '#7c2d12', // orange-900
    textLight: '#f97316', // orange-500
    border: '#fed7aa', // orange-200
    dotColor: '#f97316', // orange-500
  },
  lavender: {
    primary: '#8b5cf6', // violet-500
    secondary: '#a78bfa', // violet-400
    accent: '#c4b5fd', // violet-300
    background: '#f5f3ff', // violet-50
    backgroundAlt: '#ede9fe', // violet-100
    text: '#4c1d95', // violet-900
    textLight: '#8b5cf6', // violet-500
    border: '#ddd6fe', // violet-200
    dotColor: '#8b5cf6', // violet-500
  },
  dark: {
    primary: '#6366f1', // indigo-500
    secondary: '#818cf8', // indigo-400
    accent: '#a5b4fc', // indigo-300
    background: '#1e1b4b', // indigo-950
    backgroundAlt: '#312e81', // indigo-900
    text: '#e0e7ff', // indigo-100
    textLight: '#818cf8', // indigo-400
    border: '#4338ca', // indigo-700
    dotColor: '#6366f1', // indigo-500
  }
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('ocean');

  const value = {
    theme: themes[currentTheme],
    currentTheme,
    setTheme: (themeName) => {
      if (themes[themeName]) {
        setCurrentTheme(themeName);
      }
    },
    availableThemes: Object.keys(themes)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 