import React from 'react';

export const ClusterHealthDashboard: React.FC = () => {
  const stats = [
    { label: 'Active Workloads', value: '12', icon: '📊', trend: '+2' },
    { label: 'Pod Health', value: '99.8%', icon: '✅', trend: 'Stable' },
    { label: 'Resource Usage', value: '64%', icon: '⚙️', trend: '+5%' },
    { label: 'Alerts', value: '2', icon: '⚠️', trend: 'Critical' },
  ];

  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Cluster Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600/50 hover:border-sky-500/50 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-sky-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend === 'Critical' || stat.trend.startsWith('-')
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-green-500/20 text-green-300'
              }`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
