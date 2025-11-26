import React, { createContext, useState, useCallback } from 'react';

export interface QuickTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  category: 'backend' | 'frontend' | 'fullstack' | 'data' | 'devops';
}

export interface UserPreference {
  pinnedTemplates: string[];
  pinnedTools: string[];
}

interface PreferenceContextType {
  preferences: UserPreference;
  togglePinTemplate: (templateId: string) => void;
  togglePinTool: (toolId: string) => void;
}

export const PreferenceContext = createContext<PreferenceContextType | undefined>(undefined);

interface PreferenceProviderProps {
  children: React.ReactNode;
}

export const PreferenceProvider: React.FC<PreferenceProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreference>(() => {
    const saved = localStorage.getItem('quantamkube_preferences');
    return saved
      ? JSON.parse(saved)
      : { pinnedTemplates: [], pinnedTools: [] };
  });

  const togglePinTemplate = useCallback((templateId: string) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        pinnedTemplates: prev.pinnedTemplates.includes(templateId)
          ? prev.pinnedTemplates.filter((id) => id !== templateId)
          : [...prev.pinnedTemplates, templateId],
      };
      localStorage.setItem('quantamkube_preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const togglePinTool = useCallback((toolId: string) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        pinnedTools: prev.pinnedTools.includes(toolId)
          ? prev.pinnedTools.filter((id) => id !== toolId)
          : [...prev.pinnedTools, toolId],
      };
      localStorage.setItem('quantamkube_preferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <PreferenceContext.Provider value={{ preferences, togglePinTemplate, togglePinTool }}>
      {children}
    </PreferenceContext.Provider>
  );
};

export const usePreferences = (): PreferenceContextType => {
  const context = React.useContext(PreferenceContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferenceProvider');
  }
  return context;
};
