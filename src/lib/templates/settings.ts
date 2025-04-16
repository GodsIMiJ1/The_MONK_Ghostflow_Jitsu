import { ThemeType } from '../theme-utils';

export interface TemplateSettings {
  theme: ThemeType;
  autoSave: boolean;
  autoSaveInterval: number;
  validateOnSave: boolean;
  storageMethod: 'local' | 'indexedDB' | 'cloud';
  cloudSync: boolean;
}

const DEFAULT_SETTINGS: TemplateSettings = {
  theme: 'ghostflow-jitsu',
  autoSave: true,
  autoSaveInterval: 30,
  validateOnSave: true,
  storageMethod: 'local',
  cloudSync: false,
};

export function getSettings(): TemplateSettings {
  const settingsStr = localStorage.getItem('template-settings');
  if (!settingsStr) {
    return DEFAULT_SETTINGS;
  }
  
  try {
    const settings = JSON.parse(settingsStr);
    return { ...DEFAULT_SETTINGS, ...settings };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function updateSettings(settings: Partial<TemplateSettings>): void {
  const currentSettings = getSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem('template-settings', JSON.stringify(newSettings));
}

export const resetSettings = (): TemplateSettings => {
  localStorage.setItem('template-settings', JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}; 