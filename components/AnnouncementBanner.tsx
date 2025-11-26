import React from 'react';

export const AnnouncementBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-600/20 to-sky-600/20 border border-purple-500/30 rounded-lg p-4 mb-6 animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-2xl">📢</span>
        <div>
          <p className="font-semibold text-sky-300">QuantamKube v2.0 Released! 🎉</p>
          <p className="text-sm text-slate-300 mt-1">
            New features: Helm chart generation, GitOps integration, and real-time cluster monitoring.
            <a href="#" className="text-sky-400 hover:text-sky-300 ml-2">Learn more →</a>
          </p>
        </div>
      </div>
    </div>
  );
};
