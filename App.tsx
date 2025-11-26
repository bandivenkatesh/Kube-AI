

import React, { useState, useCallback, useEffect } from 'react';
import { InputPanel } from './components/InputPanel.tsx';
import { OutputDisplay } from './components/OutputDisplay.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { ChatHistorySidebar } from './components/ChatHistorySidebar.tsx';
import { useKubeGenerator } from './hooks/useKubeGenerator.ts';
import { useAuth } from './hooks/useAuth.tsx';
import { useChatHistory } from './hooks/useChatHistory.ts';
import { useSessionTracker } from './hooks/useSessionTracker.ts';
import type { KubeProject, ChatSession } from './types.ts';
import { Header } from './components/Header.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { StickyActionBar } from './components/StickyActionBar.tsx';
import { Footer } from './components/Footer.tsx';

export default function App() {
  // Call all hooks at the top level - BEFORE any conditional returns
  const { user, isLoading: authLoading } = useAuth();
  const [prompt, setPrompt] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<KubeProject | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { generateKubeProject, isLoading, error } = useKubeGenerator();
  const { saveChat, getChatById } = useChatHistory();
  const { deactivateSession } = useSessionTracker();

  // Reset state when user changes (logout -> login new user)
  useEffect(() => {
    if (user) {
      // Clear current session state to prevent data leakage
      setPrompt('');
      setGeneratedData(null);
      setCurrentChatId(undefined);
    } else {
      // User logged out - deactivate session
      deactivateSession();
    }
  }, [user?.id, deactivateSession]); // Only re-run if user ID changes

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setGeneratedData(null);
    setCurrentChatId(undefined);
    const data = await generateKubeProject(prompt);
    if (data) {
      setGeneratedData(data);
      // Save to chat history (user-scoped automatically)
      const chat = saveChat(prompt, data);
      if (chat) {
        setCurrentChatId(chat.id);
      }
    }
  }, [prompt, generateKubeProject, saveChat]);

  const handleSelectChat = useCallback((chat: ChatSession) => {
    setCurrentChatId(chat.id);
    setPrompt(chat.prompt);
    setGeneratedData(chat.generatedData);
    setSidebarOpen(false);
  }, []);

  const handleGoHome = useCallback(() => {
    setPrompt('');
    setGeneratedData(null);
    setCurrentChatId(undefined);
  }, []);

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-6 text-slate-200">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        isSidebarOpen={sidebarOpen}
        onHomeClick={handleGoHome}
        showHomeButton={!!generatedData}
      />
      
      <div className="flex-grow flex">
        {/* Chat History Sidebar */}
        <ChatHistorySidebar
          onSelectChat={handleSelectChat}
          currentChatId={currentChatId}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6 max-w-screen-2xl mx-auto w-full">
          <div className="lg:h-[calc(100vh-100px)] lg:sticky lg:top-20">
            <InputPanel
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:h-[calc(100vh-100px)] overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg">
                <div className="text-center p-8">
                  <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-sky-400 mx-auto"></div>
                  <h2 className="text-2xl font-semibold mt-6 text-slate-200">Generating Project...</h2>
                  <p className="text-slate-400 mt-2">AI is architecting your Kubernetes cluster. This may take a moment.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center h-full bg-red-900/20 border border-red-500 text-red-300 rounded-lg p-6">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold">Generation Failed</h2>
                  <p className="mt-2">An error occurred while communicating with the AI.</p>
                  <pre className="mt-4 text-left bg-slate-900 p-3 rounded-md text-sm">{error}</pre>
                </div>
              </div>
            )}
            {!isLoading && !error && generatedData && (
              <OutputDisplay data={generatedData} />
            )}
            {!isLoading && !error && !generatedData && (
              <WelcomeScreen setPrompt={setPrompt} />
            )}
          </div>
        </main>
      </div>

      {/* Sticky Action Bar */}
      <StickyActionBar
        onAskAI={() => console.log('Ask AI clicked')}
        onSettings={() => console.log('Settings clicked')}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
