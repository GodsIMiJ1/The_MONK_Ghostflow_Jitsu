export const AVAILABLE_THEMES = ['light', 'dark', 'ghostflow-jitsu'] as const;

export type ThemeType = typeof AVAILABLE_THEMES[number];

export interface ThemeOption {
  id: ThemeType;
  name: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'ghostflow-jitsu',
    name: 'GhostFlow Jitsu',
    description: 'Cyberpunk-inspired dark theme with neon accents'
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Classic dark theme'
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Classic light theme'
  }
]; 