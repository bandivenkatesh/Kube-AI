
import React from 'react';
import { SparklesIcon, ArrowRightIcon } from './icons.tsx';

interface InputPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ prompt, setPrompt, onGenerate, isLoading }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 flex flex-col h-full">
      <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center">
        <SparklesIcon className="w-6 h-6 mr-2 text-sky-400" />
        Describe Your Project
      </h2>
      <p className="text-slate-400 mb-4 text-sm">
        Detail your application's architecture. Mention services, databases, and how they connect. The more detail you provide, the better the result.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A Python Flask backend with a Redis cache, a React frontend, and a PostgreSQL database for user data."
        className="w-full flex-grow bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-200 resize-none text-base"
        aria-label="Project description input"
        rows={10}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading || !prompt.trim()}
        className="mt-4 w-full flex items-center justify-center bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform active:scale-95"
        aria-label="Generate Kubernetes project"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
            Generating...
          </>
        ) : (
          <>
            Generate Project
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </>
        )}
      </button>
    </div>
  );
};
