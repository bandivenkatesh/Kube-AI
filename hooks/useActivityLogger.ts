import { useCallback } from 'react';
import { useAuth } from './useAuth.tsx';
import supabase from '../supabaseClient';

export interface Activity {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'generation' | 'chat_load' | 'chat_delete' | 'export' | 'pin' | 'suggestion';
  metadata?: Record<string, any>;
  timestamp: string;
  icon: string;
}

export const useActivityLogger = () => {
  const { user } = useAuth();

  const logActivity = useCallback(
    async (
      title: string,
      description: string,
      type: Activity['type'],
      icon: string = '📝',
      metadata?: Record<string, any>
    ) => {
      if (!user) return;

      const activity: Activity = {
        id: Date.now().toString(),
        userId: user.id,
        title,
        description,
        type,
        metadata,
        timestamp: new Date().toISOString(),
        icon,
      };

      // Save to localStorage for quick access
      try {
        const activities = JSON.parse(
          localStorage.getItem(`quantamkube_activities_${user.id}`) || '[]'
        ) as Activity[];
        activities.unshift(activity);
        // Keep only last 100 activities
        localStorage.setItem(
          `quantamkube_activities_${user.id}`,
          JSON.stringify(activities.slice(0, 100))
        );
      } catch (e) {
        console.error('Failed to save activity to localStorage:', e);
      }

      // Also save to Supabase if available
      if (supabase) {
        supabase
          .from('activities')
          .insert([
            {
              id: activity.id,
              user_id: activity.userId,
              title: activity.title,
              description: activity.description,
              type: activity.type,
              metadata: activity.metadata,
              icon: activity.icon,
              created_at: activity.timestamp,
            },
          ])
          .catch((e) => console.error('Failed to log activity to Supabase:', e));
      }
    },
    [user]
  );

  const getRecentActivities = useCallback(() => {
    if (!user) return [];

    try {
      const activities = JSON.parse(
        localStorage.getItem(`quantamkube_activities_${user.id}`) || '[]'
      ) as Activity[];
      return activities;
    } catch (e) {
      console.error('Failed to get activities:', e);
      return [];
    }
  }, [user]);

  return { logActivity, getRecentActivities };
};
