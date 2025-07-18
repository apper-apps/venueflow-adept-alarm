import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setIsLoading(false);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (!savedTheme) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    
    // Enhanced CSS variables for comprehensive theming
    if (newTheme === 'light') {
      // Background colors
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--bg-surface', '#ffffff');
      root.style.setProperty('--bg-elevated', '#f1f5f9');
      root.style.setProperty('--bg-canvas', '#f8fafc');
      
      // Text colors
      root.style.setProperty('--text-primary', '#1f2937');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--text-accent', '#8b5cf6');
      
      // Border colors
      root.style.setProperty('--border-color', '#e5e7eb');
      root.style.setProperty('--border-focus', '#8b5cf6');
      root.style.setProperty('--border-error', '#ef4444');
      
      // Seat map specific colors
      root.style.setProperty('--seat-available', '#10b981');
      root.style.setProperty('--seat-occupied', '#ef4444');
      root.style.setProperty('--seat-selected', '#f59e0b');
      root.style.setProperty('--seat-vip', '#8b5cf6');
      root.style.setProperty('--zone-overlay', 'rgba(0, 0, 0, 0.1)');
      
      // Interactive elements
      root.style.setProperty('--hover-bg', '#f3f4f6');
      root.style.setProperty('--active-bg', '#e5e7eb');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.1)');
    } else {
      // Background colors
      root.style.setProperty('--bg-primary', '#111827');
      root.style.setProperty('--bg-secondary', '#1f2937');
      root.style.setProperty('--bg-surface', '#1f2937');
      root.style.setProperty('--bg-elevated', '#374151');
      root.style.setProperty('--bg-canvas', '#111827');
      
      // Text colors
      root.style.setProperty('--text-primary', '#f9fafb');
      root.style.setProperty('--text-secondary', '#d1d5db');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--text-accent', '#a78bfa');
      
      // Border colors
      root.style.setProperty('--border-color', '#374151');
      root.style.setProperty('--border-focus', '#8b5cf6');
      root.style.setProperty('--border-error', '#ef4444');
      
      // Seat map specific colors
      root.style.setProperty('--seat-available', '#10b981');
      root.style.setProperty('--seat-occupied', '#ef4444');
      root.style.setProperty('--seat-selected', '#f59e0b');
      root.style.setProperty('--seat-vip', '#8b5cf6');
      root.style.setProperty('--zone-overlay', 'rgba(255, 255, 255, 0.1)');
      
      // Interactive elements
      root.style.setProperty('--hover-bg', '#374151');
      root.style.setProperty('--active-bg', '#4b5563');
      root.style.setProperty('--shadow-color', 'rgba(0, 0, 0, 0.3)');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isLoading
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen transition-colors duration-300" 
           style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;