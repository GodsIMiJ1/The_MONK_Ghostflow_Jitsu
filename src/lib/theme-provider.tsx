'use client';

import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: 'monk';
  setTheme: (theme: 'monk') => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'monk',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // We're using a single theme, so we don't need state
  const theme = 'monk';
  const setTheme = () => {}; // No-op since we only have one theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 