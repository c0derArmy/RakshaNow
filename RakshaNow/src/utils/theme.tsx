import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@raksha_theme';

const lightTheme = {
  mode: 'light' as const,
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
};

const darkTheme = {
  mode: 'dark' as const,
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
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export type Theme = typeof darkTheme;

const ThemeContext = createContext<{
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (dark: boolean) => void;
}>({
  theme: darkTheme,
  isDark: true,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved !== null) {
        setIsDark(saved === 'dark');
      }
    } catch (e) {
      console.log('Error loading theme:', e);
    }
  };

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    try {
      await AsyncStorage.setItem(THEME_KEY, newIsDark ? 'dark' : 'light');
    } catch (e) {
      console.log('Error saving theme:', e);
    }
  };

  const setDarkMode = async (dark: boolean) => {
    setIsDark(dark);
    try {
      await AsyncStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    } catch (e) {
      console.log('Error saving theme:', e);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;
  const value = useMemo(() => ({
    theme,
    isDark,
    toggleTheme,
    setDarkMode,
  }), [isDark, theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;