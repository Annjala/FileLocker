import React, { createContext, useContext, useState, ReactNode } from 'react';

const LIGHT_COLORS = {
  TEXT: '#483847',
  SCREEN_SKIN: '#EFD7ED',
  BUTTON: '#b378afff',
  PANEL: '#D7B3D5',
};

const DARK_COLORS = {
  TEXT: '#FFFFFF',
  SCREEN_SKIN: '#000000',
  BUTTON: '#333333',
  PANEL: '#1A1A1A',
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: typeof LIGHT_COLORS;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
