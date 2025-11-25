
import React from 'react';
import { KubeIcon } from './icons.tsx';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-700">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <KubeIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-100">
            KubeArchitect <span className="text-sky-400">AI</span>
          </h1>
        </div>
        <p className="hidden md:block text-sm text-slate-400">Your AI-Powered Kubernetes Co-Pilot</p>
      </div>
    </header>
  );
};
