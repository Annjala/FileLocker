import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

type ThemeMode = 'light' | 'dark' | 'system';

type ThemeColors = {
  // Main colors
  primary: string;
  secondary: string;
  success: string;
  danger: string;
  warning: string;
  info: string;
  
  // Background colors
  background: string;
  card: string;
  modal: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Border colors
  border: string;
  
  // Status bar
  statusBar: 'light-content' | 'dark-content';
};

type Theme = {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const lightColors: ThemeColors = {
  // Main colors
  primary: '#4a6fa5',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Background colors
  background: '#f8f9fa',
  card: '#ffffff',
  modal: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  text: '#212529',
  textSecondary: '#6c757d',
  textTertiary: '#adb5bd',
  
  // Border colors
  border: '#dee2e6',
  
  // Status bar
  statusBar: 'dark-content',
};

const darkColors: ThemeColors = {
  // Main colors
  primary: '#5d8acd',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Background colors
  background: '#121212',
  card: '#1e1e1e',
  modal: 'rgba(0, 0, 0, 0.7)',
  
  // Text colors
  text: '#e9ecef',
  textSecondary: '#adb5bd',
  textTertiary: '#6c757d',
  
  // Border colors
  border: '#343a40',
  
  // Status bar
  statusBar: 'light-content',
};

const ThemeContext = createContext<Theme>({
  colors: lightColors,
  isDark: false,
  themeMode: 'light',
  setThemeMode: async () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(false);
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await SecureStore.getItemAsync('themeMode') as ThemeMode | null;
        if (savedTheme) {
          setThemeModeState(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Update theme when themeMode or system color scheme changes
  useEffect(() => {
    const updateTheme = () => {
      if (themeMode === 'system') {
        setIsDark(systemColorScheme === 'dark');
      } else {
        setIsDark(themeMode === 'dark');
      }
    };
    
    updateTheme();
  }, [themeMode, systemColorScheme]);
  
  // Save theme preference
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync('themeMode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  
  const colors = isDark ? darkColors : lightColors;
  
  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeColors = lightColors; // Export light theme colors as default
