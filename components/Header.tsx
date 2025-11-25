
import React from 'react';
import { KubeIcon, MenuIcon, LogoutIcon } from './icons.tsx';
import { useAuth } from '../hooks/useAuth.tsx';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-700">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Menu Button (Mobile) */}
          {user && (
            <button
              onClick={onMenuClick}
              className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          )}

          {/* Logo */}
          <KubeIcon className="w-8 h-8 text-sky-400" />
          <h1 className="text-2xl font-bold text-slate-100">
            KubeArchitect <span className="text-sky-400">AI</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <p className="hidden md:block text-sm text-slate-400">Your AI-Powered Kubernetes Co-Pilot</p>

          {user && (
            <div className="flex items-center gap-4 border-l border-slate-700 pl-4">
              <span className="text-sm text-slate-300">
                Welcome, <span className="font-semibold text-sky-400">{user.username}</span>
              </span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
