

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './hooks/useAuth.tsx';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import { PreferenceProvider } from './contexts/PreferenceContext.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <PreferenceProvider>
            <App />
          </PreferenceProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

