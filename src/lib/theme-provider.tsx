'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { getSettings, updateSettings } from './templates/settings';
import { ThemeType } from './theme-utils';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'ghostflow-jitsu',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<ThemeType>('ghostflow-jitsu');

  useEffect(() => {
    // Load theme from settings on mount
    const settings = getSettings();
    setTheme(settings.theme);
  }, []);

  useEffect(() => {
    // Update data-theme attribute when theme changes
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update settings when theme changes
    const settings = getSettings();
    updateSettings({ ...settings, theme });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 