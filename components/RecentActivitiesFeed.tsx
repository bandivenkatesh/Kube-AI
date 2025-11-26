import React, { useMemo } from 'react';
import { useActivityLogger } from '../hooks/useActivityLogger.ts';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'generation' | 'chat_load' | 'chat_delete' | 'export' | 'pin' | 'suggestion' | 'deployment' | 'update' | 'alert';
  icon: string;
}

export const RecentActivitiesFeed: React.FC = () => {
  const { getRecentActivities } = useActivityLogger();
  const activities = useMemo(() => {
    const real = getRecentActivities();
    // Format timestamp to readable format
    return real.map((a) => ({
      ...a,
      timestamp: formatTimeAgo(a.timestamp),
    }));
  }, [getRecentActivities]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'generation':
      case 'deployment':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'chat_load':
      case 'export':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'suggestion':
      case 'update':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'chat_delete':
      case 'alert':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pin':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-slate-600/20 text-slate-300 border-slate-600/30';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Activities</h2>
        <div className="text-center py-12 bg-slate-700/20 rounded-lg border border-slate-600/30">
          <p className="text-slate-400">No activities yet. Start generating Kubernetes projects!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Activities</h2>
      <div className="space-y-3">
        {activities.slice(0, 10).map((activity) => (
          <div
            key={activity.id}
            className={`bg-gradient-to-r from-slate-700/30 to-slate-800/20 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 rounded-lg p-4 transition-all duration-300 ${getTypeColor(activity.type)}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{activity.icon}</span>
              <div className="flex-grow">
                <p className="font-semibold text-slate-100">{activity.title}</p>
                <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-2">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}


  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">Recent Activities</h2>
      <div className="space-y-3">
        {MOCK_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className={`bg-gradient-to-r from-slate-700/30 to-slate-800/20 backdrop-blur-sm border border-slate-600/30 hover:border-slate-500/50 rounded-lg p-4 transition-all duration-300 ${getTypeColor(activity.type)} cursor-pointer hover:shadow-lg`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">{activity.icon}</span>
              <div className="flex-grow">
                <p className="font-semibold text-slate-100">{activity.title}</p>
                <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                <p className="text-xs text-slate-500 mt-2">{activity.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
