
import React from 'react';
import { KubeIcon } from './icons.tsx';

interface WelcomeScreenProps {
  setPrompt: (prompt: string) => void;
}

const examplePrompts = [
  "A simple Node.js Express API with a MongoDB database.",
  "A microservices app with a React frontend, a Go backend for authentication, and a Python service for data processing. Use a PostgreSQL database.",
  "A WordPress site with a MySQL database, including persistent storage for uploads.",
  "A Java Spring Boot application that connects to a Redis cache for session management."
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setPrompt }) => {
  return (
    <div className="bg-slate-800 rounded-lg shadow-lg h-full flex flex-col items-center justify-center p-6 text-center">
      <KubeIcon className="w-20 h-20 text-slate-600 mb-4" />
      <h2 className="text-2xl font-bold text-slate-100">Welcome to KubeArchitect AI</h2>
      <p className="mt-2 max-w-xl text-slate-400">
        Start by describing your application in the panel on the left. Or, try one of these examples to see how it works.
      </p>
      <div className="mt-8 w-full max-w-lg space-y-3">
        {examplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => setPrompt(prompt)}
            className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 rounded-md transition-colors text-sm text-slate-300"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
};
