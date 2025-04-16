export interface TemplateSettings {
  theme: 'dark' | 'light' | 'system' | 'ghostflow-jitsu';
  storage: 'local' | 'indexeddb' | 'cloud';
  autoSave: boolean;
  autoSaveInterval: number;
  validateOnSave: boolean;
  syncEnabled: boolean;
  lastSyncTime: string | null;
}

const DEFAULT_SETTINGS: TemplateSettings = {
  theme: 'ghostflow-jitsu',
  storage: 'local',
  autoSave: true,
  autoSaveInterval: 30000, // 30 seconds
  validateOnSave: true,
  syncEnabled: false,
  lastSyncTime: null,
};

const STORAGE_KEY = 'monk_template_settings';

export const getSettings = (): TemplateSettings => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const updateSettings = (updates: Partial<TemplateSettings>): TemplateSettings => {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  return newSettings;
};

export const resetSettings = (): TemplateSettings => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}; 