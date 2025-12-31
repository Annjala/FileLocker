export const lightColors = {
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
  statusBar: 'dark-content' as const,
};

export const darkColors = {
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
  statusBar: 'light-content' as const,
};

export type ThemeColors = typeof lightColors;
