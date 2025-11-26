
import React from 'react';
import { KubeIcon, MenuIcon, LogoutIcon, SunIcon, MoonIcon, ArrowRightIcon } from './icons.tsx';
import { useAuth } from '../hooks/useAuth.tsx';
import { useTheme } from '../contexts/ThemeContext.tsx';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
  onHomeClick?: () => void;
  showHomeButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen, onHomeClick, showHomeButton = false }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-700/50">
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
          <button
            onClick={onHomeClick}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            title="Back to home"
          >
            <KubeIcon className="w-8 h-8 text-sky-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
              QuantamKube.ai
            </h1>
          </button>

          {/* Home Button (when viewing results) */}
          {showHomeButton && (
            <button
              onClick={onHomeClick}
              className="ml-4 px-3 py-1.5 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowRightIcon className="w-4 h-4 rotate-180" />
              Home
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <p className="hidden md:block text-sm text-slate-400">Kubernetes Supercharged with AI</p>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-slate-400 hover:text-slate-200"
            title="Toggle theme"
          >
            {theme === 'dark' ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {user && (
            <div className="flex items-center gap-4 border-l border-slate-700 pl-4">
              <span className="text-sm text-slate-300">
                <span className="font-semibold text-sky-400">{user.username}</span>
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
