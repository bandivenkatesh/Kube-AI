import React from 'react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alice Chen',
    role: 'DevOps Engineer',
    company: 'TechCorp',
    quote: 'QuantamKube.ai reduced our deployment time from hours to minutes. Game-changer!',
    avatar: '👩‍💼',
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    role: 'CTO',
    company: 'DataFlow Systems',
    quote: 'The AI-generated manifests are production-ready. We saved weeks of manual configuration.',
    avatar: '👨‍💻',
  },
  {
    id: '3',
    name: 'Sarah Lee',
    role: 'Platform Lead',
    company: 'CloudStack Inc',
    quote: 'Best investment for our DevOps workflow. Highly recommended!',
    avatar: '👩‍🔬',
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-6 text-center">Trusted by Teams Worldwide</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600/50 hover:border-purple-500/50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{testimonial.avatar}</span>
              <div>
                <p className="font-semibold text-slate-100">{testimonial.name}</p>
                <p className="text-xs text-slate-400">{testimonial.role}</p>
                <p className="text-xs text-sky-400">{testimonial.company}</p>
              </div>
            </div>
            <p className="text-slate-300 italic">"{testimonial.quote}"</p>
            <div className="flex gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">⭐</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
