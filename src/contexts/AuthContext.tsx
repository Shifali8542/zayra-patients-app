import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, AuthTokens } from '../types';
import { api, setTokens, setRefreshFailedCallback } from '../services/api';

interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokensState] = useState<AuthTokens | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Force-logout when refresh token expires
  React.useEffect(() => {
    setRefreshFailedCallback(() => {
      setUser(null);
      setTokensState(null);
      setIsAuthenticated(false);
      setTokens(null);
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: loggedInUser, tokens: newTokens } = await api.auth.login(email, password);
      setUser(loggedInUser);
      setTokensState(newTokens);
      setIsAuthenticated(true);
    } catch (e: any) {
      setError(e?.message ?? 'Login failed. Please check your credentials.');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: newUser, tokens: newTokens } = await api.auth.register(name, email, password);
      setUser(newUser);
      setTokensState(newTokens);
      setIsAuthenticated(true);
    } catch (e: any) {
      setError(e?.message ?? 'Registration failed. Please try again.');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
      setTokensState(null);
      setIsAuthenticated(false);
      setTokens(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, tokens, isAuthenticated, login, signup, logout, loading, error, clearError }}
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