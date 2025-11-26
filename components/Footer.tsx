import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700/50 mt-12 pt-8 pb-4">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-slate-100 mb-4">QuantamKube</h3>
            <p className="text-sm text-slate-400">
              AI-powered Kubernetes deployment platform for modern DevOps teams.
            </p>
          </div>

          {/* Docs */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Documentation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Getting Started</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Best Practices</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Community</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Discord</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Forum</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Twitter</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-100 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Support Center</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Status Page</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Changelog</a></li>
              <li><a href="#" className="text-slate-400 hover:text-sky-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700/30 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2025 QuantamKube. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">Terms</a>
              <a href="#" className="text-sm text-slate-400 hover:text-sky-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
