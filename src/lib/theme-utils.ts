export type ThemeType = 'monk';

export const AVAILABLE_THEMES = ['monk'] as const;

export interface ThemeOption {
  id: ThemeType;
  name: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'monk',
    name: 'The Monk',
    description: 'Zen-inspired theme with temple aesthetics'
  }
]; 