import api from './api';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: any;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
  message: string;
}

interface UserResponse {
  success: boolean;
  data: {
    user: any;
  };
  message: string;
}

export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Get current user
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    await api.post('/auth/logout-all');
  },
};

export default authService;
