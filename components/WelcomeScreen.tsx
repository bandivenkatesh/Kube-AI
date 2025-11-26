
import React from 'react';
import { KubeIcon } from './icons.tsx';
import { HeroSection } from './HeroSection.tsx';
import { TemplateGrid } from './TemplateGrid.tsx';
import { ClusterHealthDashboard } from './ClusterHealthDashboard.tsx';
import { RecentActivitiesFeed } from './RecentActivitiesFeed.tsx';
import { TestimonialsSection } from './TestimonialsSection.tsx';
import { AnnouncementBanner } from './AnnouncementBanner.tsx';

interface WelcomeScreenProps {
  setPrompt: (prompt: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setPrompt }) => {
  return (
    <div className="w-full space-y-8 pb-20">
      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Hero Section */}
      <HeroSection onGetStarted={() => {
        const elem = document.getElementById('templates');
        elem?.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* Cluster Health Overview */}
      <ClusterHealthDashboard />

      {/* Recent Activities */}
      <RecentActivitiesFeed />

      {/* Templates Section */}
      <div id="templates">
        <TemplateGrid onSelectTemplate={setPrompt} />
      </div>

      {/* Testimonials */}
      <TestimonialsSection />
    </div>
  );
};
