import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  skipAuth: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await api.auth.login(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } catch (e) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await api.auth.signup(name, email, password);
      setUser(newUser);
      setIsAuthenticated(true);
    } catch (e) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.auth.logout();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const skipAuth = useCallback(() => {
    setUser({ ...require('../mocks/mockData').mockUser });
    setIsAuthenticated(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout, skipAuth, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
