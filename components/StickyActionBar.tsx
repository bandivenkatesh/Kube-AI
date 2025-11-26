import React, { useState } from 'react';
import { CloseIcon } from './icons.tsx';
import { SettingsModal } from './SettingsModal.tsx';

export const StickyActionBar: React.FC<{
  onAskAI: () => void;
  onSettings: () => void;
}> = ({ onAskAI, onSettings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-xl z-40 hover:scale-110"
        title="Open quick actions"
      >
        ⚡
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 rounded-lg shadow-2xl z-40 p-4 max-w-xs animate-slideInRight">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">Quick Actions</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={onAskAI}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500/20 to-sky-600/20 hover:from-sky-500/40 hover:to-sky-600/40 text-sky-300 rounded-lg transition-all border border-sky-500/30"
          >
            <span className="text-lg">💬</span>
            <span className="font-medium">Ask QuantamKube</span>
          </button>

          <button
            onClick={() => {
              setShowSettings(true);
              onSettings();
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all"
          >
            <span className="text-lg">⚙️</span>
            <span className="font-medium">Settings</span>
          </button>

          <button
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all"
          >
            <span className="text-lg">📚</span>
            <span className="font-medium">Documentation</span>
          </button>

          <button
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-all"
          >
            <span className="text-lg">❓</span>
            <span className="font-medium">Help & Support</span>
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
};
