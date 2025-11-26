import React from 'react';
import { PinIcon, UnpinIcon } from './icons.tsx';
import { usePreferences } from '../contexts/PreferenceContext.tsx';

export interface Template {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon: string;
  category: 'backend' | 'frontend' | 'fullstack' | 'data' | 'devops';
}

interface TemplateCardProps {
  template: Template;
  onSelect: (prompt: string) => void;
}

const TEMPLATES: Template[] = [
  {
    id: 'nodejs-express',
    name: 'Node.js Express API',
    description: 'RESTful API with MongoDB and authentication',
    prompt: 'A simple Node.js Express API with JWT authentication, a MongoDB database, and RESTful endpoints for user management.',
    icon: '⚙️',
    category: 'backend',
  },
  {
    id: 'microservices',
    name: 'Microservices Stack',
    description: 'React frontend with Go backend and Python services',
    prompt: 'A microservices app with a React frontend, a Go backend for authentication, a Python service for data processing, and a PostgreSQL database.',
    icon: '🏗️',
    category: 'fullstack',
  },
  {
    id: 'wordpress',
    name: 'WordPress CMS',
    description: 'WordPress with MySQL and persistent storage',
    prompt: 'A WordPress site with MySQL database, persistent storage for uploads, automated backups, and SSL/TLS encryption.',
    icon: '📝',
    category: 'fullstack',
  },
  {
    id: 'java-spring',
    name: 'Java Spring Boot',
    description: 'Spring Boot with Redis cache and PostgreSQL',
    prompt: 'A Java Spring Boot application with Redis cache for session management, PostgreSQL database, and distributed tracing.',
    icon: '☕',
    category: 'backend',
  },
  {
    id: 'ml-pipeline',
    name: 'ML Pipeline',
    description: 'TensorFlow, Jupyter, data storage, and monitoring',
    prompt: 'A machine learning pipeline with TensorFlow, Jupyter notebooks, MinIO for data storage, and Prometheus monitoring.',
    icon: '🤖',
    category: 'data',
  },
  {
    id: 'react-frontend',
    name: 'React SPA',
    description: 'Modern React app with CDN and caching',
    prompt: 'A React single-page application with Nginx reverse proxy, Redis caching, and CloudFront CDN integration.',
    icon: '⚛️',
    category: 'frontend',
  },
];

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const { preferences, togglePinTemplate } = usePreferences();
  const isPinned = preferences.pinnedTemplates.includes(template.id);

  return (
    <div className="group relative bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600/50 hover:border-sky-500/50 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-purple-500/0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="text-3xl mb-2">{template.icon}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePinTemplate(template.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              isPinned
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-slate-600/30 text-slate-400 hover:bg-slate-600/50'
            }`}
            title={isPinned ? 'Unpin template' : 'Pin template'}
          >
            {isPinned ? <PinIcon className="w-4 h-4" /> : <UnpinIcon className="w-4 h-4" />}
          </button>
        </div>

        <h3 className="text-lg font-semibold text-slate-100 mb-1">{template.name}</h3>
        <p className="text-sm text-slate-400 mb-4">{template.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 bg-sky-500/20 text-sky-300 rounded-full capitalize">
            {template.category}
          </span>
          <button
            onClick={() => onSelect(template.prompt)}
            className="text-xs px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-md transition-colors"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

export const TemplateGrid: React.FC<{ onSelectTemplate: (prompt: string) => void }> = ({
  onSelectTemplate,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Quick Start Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};
