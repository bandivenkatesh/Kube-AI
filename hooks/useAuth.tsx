import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { User, AuthContextType } from '../types.ts';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('kube_ai_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('kube_ai_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simple validation
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      // Get stored users
      const storedUsers = localStorage.getItem('kube_ai_users');
      const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Find user
      const foundUser = users.find((u) => u.username === username);
      if (!foundUser) {
        throw new Error('Invalid username or password');
      }

      // Verify password (in production, use proper hashing)
      if (foundUser.password !== password) {
        throw new Error('Invalid username or password');
      }

      const userData: User = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        createdAt: foundUser.createdAt,
      };

      setUser(userData);
      localStorage.setItem('kube_ai_user', JSON.stringify(userData));
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

      // Get stored users
      const storedUsers = localStorage.getItem('kube_ai_users');
      const users: any[] = storedUsers ? JSON.parse(storedUsers) : [];

      // Check if user exists
      if (users.some((u) => u.username === username || u.email === email)) {
        throw new Error('Username or email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password, // In production, this should be hashed!
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('kube_ai_users', JSON.stringify(users));

      // Auto-login after registration
      const userData: User = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      setUser(userData);
      localStorage.setItem('kube_ai_user', JSON.stringify(userData));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('kube_ai_user');
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
