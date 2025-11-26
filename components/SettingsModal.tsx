import React, { useState } from 'react';
import { CloseIcon } from './icons.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('quantamkube_settings');
    return saved
      ? JSON.parse(saved)
      : {
          autoSaveChats: true,
          showActivityFeed: true,
          enableNotifications: false,
          compactView: false,
          showTutorials: true,
          enableAnalytics: true,
        };
  });

  const handleToggle = (key: keyof typeof settings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem('quantamkube_settings', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800/95 backdrop-blur-lg rounded-lg border border-slate-700/50 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/30 sticky top-0 bg-slate-800/95">
          <h2 className="text-2xl font-bold text-slate-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Settings */}
        <div className="p-6 space-y-6">
          {/* Auto-save Chats */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-100">Auto-Save Chats</p>
              <p className="text-sm text-slate-400">Automatically save your generation results</p>
            </div>
            <ToggleSwitch
              enabled={settings.autoSaveChats}
              onChange={() => handleToggle('autoSaveChats')}
            />
          </div>

          {/* Show Activity Feed */}
          <div className="flex items-center justify-between border-t border-slate-700/30 pt-6">
            <div>
              <p className="font-semibold text-slate-100">Activity Feed</p>
              <p className="text-sm text-slate-400">Display recent activities on home</p>
            </div>
            <ToggleSwitch
              enabled={settings.showActivityFeed}
              onChange={() => handleToggle('showActivityFeed')}
            />
          </div>

          {/* Enable Notifications */}
          <div className="flex items-center justify-between border-t border-slate-700/30 pt-6">
            <div>
              <p className="font-semibold text-slate-100">Notifications</p>
              <p className="text-sm text-slate-400">Get alerts for important events</p>
            </div>
            <ToggleSwitch
              enabled={settings.enableNotifications}
              onChange={() => handleToggle('enableNotifications')}
            />
          </div>

          {/* Compact View */}
          <div className="flex items-center justify-between border-t border-slate-700/30 pt-6">
            <div>
              <p className="font-semibold text-slate-100">Compact View</p>
              <p className="text-sm text-slate-400">Use compact layout for better spacing</p>
            </div>
            <ToggleSwitch
              enabled={settings.compactView}
              onChange={() => handleToggle('compactView')}
            />
          </div>

          {/* Show Tutorials */}
          <div className="flex items-center justify-between border-t border-slate-700/30 pt-6">
            <div>
              <p className="font-semibold text-slate-100">Getting Started Guide</p>
              <p className="text-sm text-slate-400">Show tips for new users</p>
            </div>
            <ToggleSwitch
              enabled={settings.showTutorials}
              onChange={() => handleToggle('showTutorials')}
            />
          </div>

          {/* Analytics */}
          <div className="flex items-center justify-between border-t border-slate-700/30 pt-6">
            <div>
              <p className="font-semibold text-slate-100">Analytics</p>
              <p className="text-sm text-slate-400">Help us improve with usage data</p>
            </div>
            <ToggleSwitch
              enabled={settings.enableAnalytics}
              onChange={() => handleToggle('enableAnalytics')}
            />
          </div>

          {/* Account Section */}
          <div className="border-t border-slate-700/30 pt-6">
            <p className="font-semibold text-slate-100 mb-3">Account</p>
            <button className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm">
              Change Password
            </button>
            <button className="w-full px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm mt-2">
              Export Data
            </button>
            <button className="w-full px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-300 rounded-lg transition-colors text-sm mt-2 border border-red-500/30">
              Delete Account
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors border-t border-slate-700/30 mt-6 pt-6"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-sky-600' : 'bg-slate-600'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);
