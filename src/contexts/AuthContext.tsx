import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, AuthTokens } from '../types';
import { api, setTokens, setRefreshFailedCallback } from '../services/api';

// Persistence keys 
const KEY_ACCESS  = 'zayra_access_token';
const KEY_REFRESH = 'zayra_refresh_token';
const KEY_USER    = 'zayra_user';

async function persistSession(user: User, tokens: AuthTokens): Promise<void> {
  try {
    await AsyncStorage.multiSet([
      [KEY_ACCESS,  tokens.access],
      [KEY_REFRESH, tokens.refresh],
      [KEY_USER,    JSON.stringify(user)],
    ]);
  } catch { }
}

async function clearSession(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEY_ACCESS, KEY_REFRESH, KEY_USER]);
  } catch { }
}

async function restoreSession(): Promise<{ user: User; tokens: AuthTokens } | null> {
  try {
    const [[, access], [, refresh], [, userRaw]] = await AsyncStorage.multiGet([
      KEY_ACCESS, KEY_REFRESH, KEY_USER,
    ]);
    if (!access || !refresh || !userRaw) return null;
    const user = JSON.parse(userRaw) as User;
    return { user, tokens: { access, refresh } };
  } catch {
    return null;
  }
}

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
  const [loading, setLoading] = useState(true); // true until session restore completes
  const [error, setError] = useState<string | null>(null);

  // Restore session on app start
  useEffect(() => {
    restoreSession().then((saved) => {
      if (saved) {
        setTokens(saved.tokens);
        setUser(saved.user);
        setTokensState(saved.tokens);
        setIsAuthenticated(true);
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Register
  useEffect(() => {
    setRefreshFailedCallback(() => {
      clearSession();
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
      const { user: u, tokens: t } = await api.auth.login(email, password);
      await persistSession(u, t); 
      setUser(u);
      setTokensState(t);
      setIsAuthenticated(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed. Please check your credentials.';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: u, tokens: t } = await api.auth.register(name, email, password);
      await persistSession(u, t);
      setUser(u);
      setTokensState(t);
      setIsAuthenticated(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Registration failed. Please try again.';
      setError(msg);
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
      await clearSession();
      setUser(null);
      setTokensState(null);
      setIsAuthenticated(false);
      setTokens(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated,
        login,
        signup,
        logout,
        loading,
        error,
        clearError,
      }}
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