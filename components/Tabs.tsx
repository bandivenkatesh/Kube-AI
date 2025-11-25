
import React from 'react';

interface TabsProps {
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  return (
    <div className="border-b border-slate-700 px-4 md:px-6">
      <nav className="-mb-px flex space-x-4" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
};

interface TabProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  activeTab: string;
  setActiveTab: (name: string) => void;
}

export const Tab: React.FC<TabProps> = ({ icon, label, name, activeTab, setActiveTab }) => {
  const isActive = activeTab === name;
  return (
    <button
      onClick={() => setActiveTab(name)}
      className={`
        ${isActive
          ? 'border-sky-500 text-sky-400'
          : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
        }
        flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-t-sm
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      <span className="w-5 h-5 mr-2">{icon}</span>
      {label}
    </button>
  );
};
