import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isParent?: boolean;
  avatar?: string;
  profilePicture?: string;
  xp?: number;
  level?: number;
  badges?: string[];
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, firstName: string, lastName: string, isParent: boolean) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const savedUser = localStorage.getItem('bitbuds-user');

      if (accessToken && savedUser) {
        try {
          // Verify token is still valid by fetching current user
          const response = await authService.getCurrentUser();
          setUser(response.data.user);
          localStorage.setItem('bitbuds-user', JSON.stringify(response.data.user));
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('bitbuds-user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { user: userData, tokens } = response.data;

      // Save tokens and user data
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('bitbuds-user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string, isParent: boolean) => {
    setLoading(true);
    try {
      const role = isParent ? 'parent' : 'user';
      const response = await authService.register({
        email,
        password,
        firstName,
        lastName,
        role
      });
      const { user: userData, tokens } = response.data;

      // Save tokens and user data
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('bitbuds-user', JSON.stringify(userData));

      setUser(userData);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('bitbuds-user');
    }
  };

  const value = {
    user,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};