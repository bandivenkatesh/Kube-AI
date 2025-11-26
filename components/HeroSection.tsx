import React from 'react';

export const HeroSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-slate-700/50 rounded-xl p-8 md:p-12 overflow-hidden mb-8">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-sky-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">⚡</span>
          <span className="text-xs font-semibold px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full">
            AI-Powered Kubernetes
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            Supercharge Kubernetes
          </span>
          <span className="block text-slate-100">with AI</span>
        </h1>

        <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
          QuantamKube.ai generates production-ready Kubernetes manifests, Dockerfiles, and Helm charts in seconds.
          Describe your infrastructure, and let AI handle the complexity.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50"
          >
            🚀 Generate Project
          </button>
          <button
            onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-100 font-semibold rounded-lg border border-slate-600 transition-all duration-300"
          >
            📚 Browse Templates
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-700/30">
          <div>
            <p className="text-2xl font-bold text-sky-400">100%</p>
            <p className="text-sm text-slate-400">AI Generated</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-sky-400">5s</p>
            <p className="text-sm text-slate-400">Time to Deploy</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-sky-400">∞</p>
            <p className="text-sm text-slate-400">Possibilities</p>
          </div>
        </div>
      </div>
    </div>
  );
};
