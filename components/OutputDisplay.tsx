
import React, { useState } from 'react';
import type { KubeProject, GeneratedFile, Explanation } from '../types.ts';
import { CodeBlock } from './CodeBlock.tsx';
import { Tabs, Tab } from './Tabs.tsx';
import { ArchitectureIcon, CodeIcon, DockerIcon, BookOpenIcon } from './icons.tsx';

interface OutputDisplayProps {
  data: KubeProject;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ArchitectureOverview content={data.architectureOverview} />;
      case 'manifests':
        return <FileContent files={data.kubernetesManifests} fileType="Kubernetes Manifest" />;
      case 'dockerfiles':
        return <FileContent files={data.dockerfiles} fileType="Dockerfile" />;
      case 'explanations':
        return <Explanations explanations={data.explanations} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg h-full flex flex-col">
      <Tabs>
        <Tab icon={<ArchitectureIcon />} label="Overview" name="overview" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab icon={<CodeIcon />} label="Manifests" name="manifests" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab icon={<DockerIcon />} label="Dockerfiles" name="dockerfiles" activeTab={activeTab} setActiveTab={setActiveTab} />
        <Tab icon={<BookOpenIcon />} label="Explanations" name="explanations" activeTab={activeTab} setActiveTab={setActiveTab} />
      </Tabs>
      <div className="p-4 md:p-6 flex-grow overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

const ArchitectureOverview: React.FC<{ content: string }> = ({ content }) => (
  <div className="prose prose-invert prose-slate max-w-none prose-p:text-slate-300 prose-headings:text-slate-100">
    <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700 pb-2 mb-4">Architecture Overview</h3>
    <p>{content}</p>
  </div>
);

const FileContent: React.FC<{ files: GeneratedFile[], fileType: string }> = ({ files, fileType }) => (
  <div>
    <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700 pb-2 mb-4">{fileType}s</h3>
    <div className="space-y-6">
      {files.map((file, index) => (
        <div key={index}>
          <h4 className="font-mono text-sm font-semibold text-sky-400">{file.fileName}</h4>
          <p className="text-slate-400 text-sm mb-2">{file.description}</p>
          <CodeBlock code={file.content} language="yaml" />
        </div>
      ))}
    </div>
  </div>
);

const Explanations: React.FC<{ explanations: Explanation[] }> = ({ explanations }) => (
  <div>
    <h3 className="text-lg font-semibold text-slate-100 border-b border-slate-700 pb-2 mb-4">Concept Explanations</h3>
    <div className="space-y-4">
      {explanations.map((exp, index) => (
        <details key={index} className="bg-slate-900/50 rounded-lg" open={index === 0}>
          <summary className="p-4 font-semibold cursor-pointer text-slate-200 hover:bg-slate-700/50 rounded-t-lg transition-colors">
            {exp.concept}
          </summary>
          <div className="p-4 border-t border-slate-700 text-slate-300">
            <p>{exp.explanation}</p>
          </div>
        </details>
      ))}
    </div>
  </div>
);
