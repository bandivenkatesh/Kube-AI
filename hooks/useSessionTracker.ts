import { useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import supabase from '../supabaseClient';
import { getSessionId } from '../utils/sessionManager';

export const useSessionTracker = () => {
  const { user } = useAuth();

  // Save session to Supabase
  const saveSession = useCallback(async () => {
    if (!user || !supabase) return;

    const sessionId = getSessionId();
    const userAgent = navigator.userAgent;
    const ipAddress = 'unknown'; // Would require backend API to get real IP

    try {
      const { error } = await supabase.from('sessions').upsert({
        id: sessionId,
        user_id: user.id,
        session_data: {
          theme: localStorage.getItem('quantamkube_theme') || 'dark',
          lastActive: new Date().toISOString(),
        },
        user_agent: userAgent,
        ip_address: ipAddress,
        is_active: true,
        last_activity: new Date().toISOString(),
      });

      if (error) console.error('Failed to save session:', error);
    } catch (e) {
      console.error('Session save error:', e);
    }
  }, [user]);

  // Track activity (update last_activity)
  const trackActivity = useCallback(async () => {
    if (!user || !supabase) return;

    const sessionId = getSessionId();

    try {
      await supabase
        .from('sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId)
        .eq('user_id', user.id);
    } catch (e) {
      console.error('Failed to track activity:', e);
    }
  }, [user]);

  // Deactivate session on logout
  const deactivateSession = useCallback(async () => {
    if (!user || !supabase) return;

    const sessionId = getSessionId();

    try {
      await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('id', sessionId)
        .eq('user_id', user.id);
    } catch (e) {
      console.error('Failed to deactivate session:', e);
    }
  }, [user]);

  // Initialize session on user login
  useEffect(() => {
    if (user) {
      saveSession();
    }
  }, [user?.id, saveSession]);

  // Track activity every 30 seconds
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      trackActivity();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, trackActivity]);

  return { trackActivity, deactivateSession };
};
