// Global theme state - sab screens access kar sakte hain
let globalIsDarkMode = true;

export const setGlobalTheme = (isDark: boolean) => {
  globalIsDarkMode = isDark;
};

export const getGlobalTheme = () => globalIsDarkMode;

// Theme colors - use in all screens
export const getThemeColors = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      background: '#061423',
      backgroundSecondary: '#132030',
      card: '#1A2744',
      cardBorder: 'rgba(255, 255, 255, 0.05)',
      primary: '#d32f2f',
      primaryLight: '#ffb3ac',
      text: '#d6e4f9',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      border: 'rgba(255, 255, 255, 0.05)',
      success: '#76daa3',
      warning: '#fbbf24',
      error: '#d32f2f',
      icon: '#64748b',
      iconActive: '#ffb3ac',
      header: '#132030',
      headerText: '#ffb3ac',
      statusBar: '#132030',
    };
  } else {
    return {
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      card: '#ffffff',
      cardBorder: '#e2e8f0',
      primary: '#d32f2f',
      primaryLight: '#ffb3ac',
      text: '#1e293b',
      textSecondary: '#64748b',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      success: '#038051',
      warning: '#fbbf24',
      error: '#d32f2f',
      icon: '#64748b',
      iconActive: '#d32f2f',
      header: '#ffffff',
      headerText: '#1e293b',
      statusBar: '#ffffff',
    };
  }
};

export default { setGlobalTheme, getGlobalTheme, getThemeColors };