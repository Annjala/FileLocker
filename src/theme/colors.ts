export const lightColors = {
  // Main colors - Purple theme
  primary: '#9F7AEA',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Background colors - Lavender/Purple
  background: '#E9D5FF',
  card: '#ffffff',
  modal: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  text: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Border colors
  border: '#D1D5DB',
  
  // Status bar
  statusBar: 'dark-content' as const,
  
  // Additional colors for home screen
  homeBackground: '#D4B5A0',
};

export const darkColors = {
  // Main colors
  primary: '#9F7AEA',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  
  // Background colors
  background: '#1F1B24',
  card: '#2D2838',
  modal: 'rgba(0, 0, 0, 0.7)',
  
  // Text colors
  text: '#e9ecef',
  textSecondary: '#adb5bd',
  textTertiary: '#6c757d',
  
  // Border colors
  border: '#343a40',
  
  // Status bar
  statusBar: 'light-content' as const,
  
  // Additional colors
  homeBackground: '#2D2838',
};

export type ThemeColors = typeof lightColors;