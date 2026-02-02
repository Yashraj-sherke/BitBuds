import api from './api';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicture?: string;
}

interface UserResponse {
  success: boolean;
  data: {
    user: any;
  };
  message: string;
}

export const userService = {
  // Get user by ID
  getUserById: async (userId: string): Promise<UserResponse> => {
    const response = await api.get<UserResponse>(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateUser: async (userId: string, data: UpdateUserData): Promise<UserResponse> => {
    const response = await api.patch<UserResponse>(`/users/${userId}`, data);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (params?: any): Promise<any> => {
    const response = await api.get('/users', { params });
    return response.data;
  },
};

export default userService;
