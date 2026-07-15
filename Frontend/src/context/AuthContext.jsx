import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ApiError, clearAccessToken, request, setAccessToken } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCurrentUser = async () => {
    try {
      const refreshPayload = await request('/auth/refresh', {
        method: 'POST',
        body: {},
        retryOn401: false,
      });

      setAccessToken(refreshPayload.tokens.accessToken);
      const mePayload = await request('/auth/me');
      setUser(mePayload.user);
      setError(null);
      return mePayload.user;
    } catch (err) {
      clearAccessToken();
      setUser(null);
      if (err instanceof ApiError && err.statusCode !== 401) {
        setError(err.message);
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCurrentUser();
  }, []);

  const login = async (payload) => {
    const session = await request('/auth/login', {
      method: 'POST',
      body: payload,
      retryOn401: false,
    });

    setAccessToken(session.tokens.accessToken);
    setUser(session.user);
    setError(null);
    return session.user;
  };

  const register = async (payload) => {
    const session = await request('/auth/register', {
      method: 'POST',
      body: payload,
      retryOn401: false,
    });

    setAccessToken(session.tokens.accessToken);
    setUser(session.user);
    setError(null);
    return session.user;
  };

  const refreshSession = async () => loadCurrentUser();

  const logout = async () => {
    try {
      await request('/auth/logout', {
        method: 'POST',
        body: {},
      });
    } catch {
      // Clear local auth state even if the server-side revoke fails.
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const updateProfile = async (payload) => {
    if (!user) {
      throw new Error('No authenticated hero profile is loaded');
    }

    const updated = await request(`/users/${user._id}`, {
      method: 'PATCH',
      body: payload,
    });

    setUser(updated.user);
    return updated.user;
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      error,
      login,
      register,
      refreshSession,
      logout,
      updateProfile,
    }),
    [error, isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return value;
}
