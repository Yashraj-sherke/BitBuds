import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
  ApiUser,
  AuthSessionPayload,
  AuthTokens,
  LoginRequest,
  RefreshPayload,
  RegisterRequest,
  UpdateUserRequest,
} from './types/api';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  storyContext: string;
}

export interface Task {
  id: number; // 1 to 10
  title: string;
  story: string;
  objective: string;
  defaultBlocks: string[];
  correctBlocks: string[];
  points: number;
  mascotExpr: 'happy' | 'thinking' | 'victory' | 'sad';
  gridSize: { rows: number; cols: number };
  startPos: { x: number; y: number };
  targetPos: { x: number; y: number };
  obstacles: { x: number; y: number }[];
}

export interface UserProgress {
  points: number;
  currentLevel: number; // 1 to 10
  unlockedLevel: number; // up to 10
  selectedDomain: string;
  selectedDifficulty: Difficulty;
  avatar: string;
  username?: string;
}

export class ApiError extends Error {
  statusCode: number;
  details: unknown;

  constructor(statusCode: number, message: string, details: unknown = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1').trim().replace(/\/$/, '');

let accessToken: string | null = null;
let refreshInFlight: Promise<string | null> | null = null;

export const getApiBaseUrl = () => API_BASE_URL;
export const getAccessToken = () => accessToken;
export const setAccessToken = (nextToken: string | null) => {
  accessToken = nextToken;
};
export const clearAccessToken = () => {
  accessToken = null;
};

const buildUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const readJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
};

const parseErrorMessage = (payload: unknown, fallback: string) => {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return fallback;
};

const refreshAccessToken = async () => {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(buildUrl('/auth/refresh'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorPayload = await readJson<unknown>(response).catch(() => null);
        throw new ApiError(response.status, parseErrorMessage(errorPayload, 'Unable to refresh session'), errorPayload);
      }

      const payload = await readJson<RefreshPayload>(response);
      const nextToken = payload?.tokens?.accessToken ?? null;
      setAccessToken(nextToken);
      return nextToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }

  return refreshInFlight;
};

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  retryOn401?: boolean;
};

export const request = async <TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> => {
  const { body, retryOn401 = true, headers, ...requestInit } = options;
  const nextHeaders = new Headers(headers);

  if (accessToken) {
    nextHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const hasBody = body !== undefined;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (hasBody && !isFormData && !nextHeaders.has('Content-Type')) {
    nextHeaders.set('Content-Type', 'application/json');
  }

  const response = await fetch(buildUrl(path), {
    ...requestInit,
    headers: nextHeaders,
    credentials: 'include',
    body: hasBody
      ? isFormData || typeof body === 'string'
        ? (body as BodyInit)
        : JSON.stringify(body)
      : undefined,
  });

  if (response.status === 401 && retryOn401 && path !== '/auth/refresh') {
    const refreshed = await refreshAccessToken().catch(() => null);
    if (refreshed) {
      return request<TResponse>(path, { ...options, retryOn401: false });
    }
  }

  if (!response.ok) {
    const errorPayload = await readJson<unknown>(response).catch(() => null);
    throw new ApiError(response.status, parseErrorMessage(errorPayload, response.statusText || 'Request failed'), errorPayload);
  }

  const payload = await readJson<{ data: TResponse }>(response);
  return payload.data;
};

export const heroNameToEmail = (heroName: string) => {
  const slug = heroName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') || 'hero';
  return `${slug}@bitbuds.local`;
};

export const apiUserToProgress = (user: ApiUser, overrides: Partial<UserProgress> = {}): UserProgress => {
  const displayName = user.fullName?.trim() || `${user.firstName} ${user.lastName}`;

  return {
    points: user.xp,
    currentLevel: user.level,
    unlockedLevel: user.level,
    selectedDomain: overrides.selectedDomain ?? 'robo-logic',
    selectedDifficulty: overrides.selectedDifficulty ?? 'beginner',
    avatar: overrides.avatar ?? user.profilePicture ?? '🦖',
    username: overrides.username ?? displayName,
  };
};

interface AuthContextValue {
  user: ApiUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (payload: LoginRequest) => Promise<ApiUser>;
  register: (payload: RegisterRequest) => Promise<ApiUser>;
  refreshSession: () => Promise<ApiUser | null>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateUserRequest, userId?: string) => Promise<ApiUser>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCurrentUser = async () => {
    try {
      const refreshPayload = await request<RefreshPayload>('/auth/refresh', {
        method: 'POST',
        body: {},
        retryOn401: false,
      });

      setAccessToken(refreshPayload.tokens.accessToken);
      const mePayload = await request<{ user: ApiUser }>('/auth/me');
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

  const login = async (payload: LoginRequest) => {
    const session = await request<AuthSessionPayload>('/auth/login', {
      method: 'POST',
      body: payload,
      retryOn401: false,
    });

    setAccessToken(session.tokens.accessToken);
    setUser(session.user);
    setError(null);
    return session.user;
  };

  const register = async (payload: RegisterRequest) => {
    const session = await request<AuthSessionPayload>('/auth/register', {
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
      await request<null>('/auth/logout', {
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

  const updateProfile = async (payload: UpdateUserRequest, userId?: string) => {
    const targetUserId = userId ?? user?._id;

    if (!targetUserId) {
      throw new Error('No authenticated hero profile is loaded');
    }

    const updated = await request<{ user: ApiUser }>(`/users/${targetUserId}`, {
      method: 'PATCH',
      body: payload,
    });

    setUser(updated.user);
    return updated.user;
  };

  const value = useMemo<AuthContextValue>(
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

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return value;
}
