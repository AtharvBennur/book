import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('be_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('be_token'));
  const [status, setStatus] = useState('bootstrapping'); // bootstrapping | ready
  const [error, setError] = useState(null);

  const persist = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem('be_token', nextToken);
      setToken(nextToken);
    }
    if (nextUser) {
      localStorage.setItem('be_user', JSON.stringify(nextUser));
      setUser(nextUser);
    }
  };

  const clearSession = useCallback(() => {
    localStorage.removeItem('be_token');
    localStorage.removeItem('be_user');
    setToken(null);
    setUser(null);
  }, []);

  const bootstrap = useCallback(async () => {
    if (!token) {
      setStatus('ready');
      return;
    }
    try {
      const profile = await authApi.me(token);
      persist(token, profile);
    } catch (err) {
      clearSession();
    } finally {
      setStatus('ready');
    }
  }, [token, clearSession]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (email, password) => {
      setError(null);
      const { token: nextToken, user: nextUser } = await authApi.login({ email, password });
      persist(nextToken, nextUser);
      return nextUser;
    },
    []
  );

  const signup = useCallback(
    async (payload) => {
      setError(null);
      const { token: nextToken, user: nextUser } = await authApi.signup(payload);
      persist(nextToken, nextUser);
      return nextUser;
    },
    []
  );

  const logout = useCallback(() => {
    clearSession();
    setStatus('ready');
  }, [clearSession]);

  const updateProfile = useCallback(
    async (payload) => {
      if (!token || !user) throw new Error('Not authenticated');
      const updated = await authApi.updateProfile(user.id, payload, token);
      persist(token, updated);
      return updated;
    },
    [token, user]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      isAuthenticated: Boolean(user),
      error,
      login,
      signup,
      logout,
      updateProfile,
      refreshProfile: bootstrap,
    }),
    [user, token, status, error, login, signup, logout, updateProfile, bootstrap]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

