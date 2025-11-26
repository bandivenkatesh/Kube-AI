import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '../types.ts';
import supabase from '../supabaseClient';
import { setUserStorage, getUserStorage, clearUserData, clearSessionId, getSessionId } from '../utils/sessionManager';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from Supabase or localStorage on mount
  useEffect(() => {
    const init = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Supabase session error:', error);
          }
          const session = data?.session;
          if (session && session.user) {
            // Fetch profile from 'profiles' table
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, username, email, created_at')
                .eq('id', session.user.id)
                .single();

              if (profile) {
                const userData: User = {
                  id: profile.id,
                  username: profile.username || profile.email,
                  email: profile.email,
                  createdAt: profile.created_at || new Date().toISOString(),
                };
                setUser(userData);
                // Store in user-namespaced storage
                setUserStorage(userData.id, 'user_data', JSON.stringify(userData));
                getSessionId(); // Generate session ID for this user
              }
            } catch (e) {
              console.error('Failed to fetch profile:', e);
            }
          } else {
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Auth init error:', e);
        }
      }
      setIsLoading(false);
    };

    init();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      if (!username || !password) {
        throw new Error('Username (or email) and password are required');
      }

      if (supabase) {
        // Supabase expects an email
        let emailToUse = username;
        if (!username.includes('@')) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', username)
            .single();
          if (profile && (profile as any).email) {
            emailToUse = (profile as any).email;
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
        if (error) throw error;

        const sessionUser = data?.user;
        if (sessionUser) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, username, email, created_at')
            .eq('id', sessionUser.id)
            .single();

          const userData: User = {
            id: sessionUser.id,
            username: profile?.username || sessionUser.email || username,
            email: sessionUser.email || profile?.email || '',
            createdAt: profile?.created_at || new Date().toISOString(),
          };

          setUser(userData);
          // Store in user-namespaced storage
          setUserStorage(userData.id, 'user_data', JSON.stringify(userData));
          getSessionId(); // Generate new session ID
        }
      } else {
        throw new Error('Supabase not configured');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      if (supabase) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error && (error as any).status !== 400) {
          throw error;
        }

        const userId = (data as any)?.user?.id || Date.now().toString();
        const { error: profileErr } = await supabase.from('profiles').upsert({
          id: userId,
          username,
          email,
          created_at: new Date().toISOString(),
        });

        if (profileErr) console.error('Failed to upsert profile:', profileErr);

        const userData: User = {
          id: userId,
          username,
          email,
          createdAt: new Date().toISOString(),
        };

        setUser(userData);
        setUserStorage(userData.id, 'user_data', JSON.stringify(userData));
        getSessionId();
      } else {
        throw new Error('Supabase not configured');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    // Clear user-specific data
    if (user) {
      clearUserData(user.id);
    }
    clearSessionId();
    
    setUser(null);

    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Supabase signOut error:', e);
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
