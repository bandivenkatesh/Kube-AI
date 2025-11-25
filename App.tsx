
import React, { useState, useCallback } from 'react';
import { InputPanel } from './components/InputPanel.tsx';
import { OutputDisplay } from './components/OutputDisplay.tsx';
import { useKubeGenerator } from './hooks/useKubeGenerator.ts';
import type { KubeProject } from './types.ts';
import { Header } from './components/Header.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';

export default function App() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedData, setGeneratedData] = useState<KubeProject | null>(null);
  const { generateKubeProject, isLoading, error } = useKubeGenerator();

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setGeneratedData(null);
    const data = await generateKubeProject(prompt);
    if (data) {
      setGeneratedData(data);
    }
  }, [prompt, generateKubeProject]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
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
  );
}
