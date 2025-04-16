import React, { useState, useEffect } from 'react';
import { TemplateSettings, getSettings, updateSettings, resetSettings } from '../lib/templates/settings';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: TemplateSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose, onSettingsChange }) => {
  const [settings, setSettings] = useState<TemplateSettings>(getSettings());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getSettings());
    }
  }, [isOpen]);

  const handleChange = (key: keyof TemplateSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleReset = () => {
    const defaultSettings = resetSettings();
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
    setShowResetConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Template Settings</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <option value="ghostflow-jitsu">GhostFlow Jitsu</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <h3>Storage</h3>
          <div className="setting-item">
            <label>Storage Method</label>
            <select
              value={settings.storage}
              onChange={(e) => handleChange('storage', e.target.value)}
            >
              <option value="local">Local Storage</option>
              <option value="indexeddb">IndexedDB</option>
              <option value="cloud" disabled>Cloud Sync (Coming Soon)</option>
            </select>
          </div>
        </div>

        <div className="setting-group">
          <h3>Auto Save</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleChange('autoSave', e.target.checked)}
              />
              Enable Auto Save
            </label>
          </div>
          <div className="setting-item">
            <label>Auto Save Interval (ms)</label>
            <input
              type="number"
              value={settings.autoSaveInterval}
              onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value))}
              min="1000"
              step="1000"
              disabled={!settings.autoSave}
            />
          </div>
        </div>

        <div className="setting-group">
          <h3>Validation</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.validateOnSave}
                onChange={(e) => handleChange('validateOnSave', e.target.checked)}
              />
              Validate on Save
            </label>
          </div>
        </div>

        <div className="setting-group">
          <h3>Sync</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.syncEnabled}
                onChange={(e) => handleChange('syncEnabled', e.target.checked)}
                disabled
              />
              Enable Cloud Sync (Coming Soon)
            </label>
          </div>
          {settings.lastSyncTime && (
            <div className="setting-item">
              <label>Last Sync</label>
              <span>{new Date(settings.lastSyncTime).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="settings-actions">
          {showResetConfirm ? (
            <div className="reset-confirm">
              <p>Are you sure you want to reset all settings?</p>
              <button onClick={handleReset}>Yes, Reset</button>
              <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
            </div>
          ) : (
            <button
              className="reset-button"
              onClick={() => setShowResetConfirm(true)}
            >
              Reset to Defaults
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 