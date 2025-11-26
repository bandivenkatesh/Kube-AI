import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '../types.ts';
import supabase from '../supabaseClient';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const init = async () => {
      if (supabase) {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Supabase session error:', error);
        }
        const session = data?.session;
        if (session && session.user) {
          // Try to fetch profile from 'profiles' table
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
              localStorage.setItem('kube_ai_user', JSON.stringify(userData));
            }
          } catch (e) {
            console.error('Failed to fetch profile:', e);
          }
        } else {
          // Fallback to localStorage
          const storedUser = localStorage.getItem('kube_ai_user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              console.error('Failed to parse stored user:', e);
              localStorage.removeItem('kube_ai_user');
            }
          }
        }
      } else {
        const storedUser = localStorage.getItem('kube_ai_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse stored user:', e);
            localStorage.removeItem('kube_ai_user');
          }
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
        // Supabase expects an email; allow passing email or username (if username, try to lookup email)
        let emailToUse = username;
        if (!username.includes('@')) {
          // lookup profile by username
          const { data: profile } = await supabase.from('profiles').select('email').eq('username', username).single();
          if (profile && (profile as any).email) {
            emailToUse = (profile as any).email;
          }
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email: emailToUse, password });
        if (error) throw error;

        const sessionUser = data?.user;
        if (sessionUser) {
          const { data: profile } = await supabase.from('profiles').select('id, username, email, created_at').eq('id', sessionUser.id).single();
          const userData: User = {
            id: sessionUser.id,
            username: profile?.username || sessionUser.email || username,
            email: sessionUser.email || profile?.email || '',
            createdAt: profile?.created_at || new Date().toISOString(),
          };
          setUser(userData);
          localStorage.setItem('kube_ai_user', JSON.stringify(userData));
        }
      } else {
        // Fallback to localStorage (legacy)
        if (!username || !password) {
          throw new Error('Username and password are required');
        }

        const storedUsers = localStorage.getItem('kube_ai_users');
        const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

        const foundUser = users.find((u) => u.username === username || u.email === username);
        if (!foundUser) throw new Error('Invalid username or password');
        if (foundUser.password !== password) throw new Error('Invalid username or password');

        const userData: User = {
          id: foundUser.id,
          username: foundUser.username,
          email: foundUser.email,
          createdAt: foundUser.createdAt,
        };

        setUser(userData);
        localStorage.setItem('kube_ai_user', JSON.stringify(userData));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Validation
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
        // Use Supabase Auth to create user
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error && (error as any).status !== 400) {
          // status 400 may indicate user already exists depending on Supabase settings
          throw error;
        }

        // Insert profile record (if not exists)
        const userId = (data as any)?.user?.id || Date.now().toString();
        const { error: profileErr } = await supabase.from('profiles').upsert({ id: userId, username, email, created_at: new Date().toISOString() });
        if (profileErr) console.error('Failed to upsert profile:', profileErr);

        const userData: User = {
          id: userId,
          username,
          email,
          createdAt: new Date().toISOString(),
        };

        setUser(userData);
        localStorage.setItem('kube_ai_user', JSON.stringify(userData));
      } else {
        // Fallback legacy localStorage registration
        const storedUsers = localStorage.getItem('kube_ai_users');
        const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

        if (users.some((u) => u.username === username || u.email === email)) {
          throw new Error('Username or email already exists');
        }

        const newUser = {
          id: Date.now().toString(),
          username,
          email,
          password,
          createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem('kube_ai_users', JSON.stringify(users));

        const userData: User = {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
        };

        setUser(userData);
        localStorage.setItem('kube_ai_user', JSON.stringify(userData));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('kube_ai_user');
    if (supabase) {
      supabase.auth.signOut().catch((e) => console.error('Supabase signOut error:', e));
    }
  }, []);

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
