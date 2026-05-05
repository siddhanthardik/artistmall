import { api } from './api';
import { useAuthStore } from '../store/authStore';

export const AuthService = {
  login: async (credentials: Record<string, unknown>) => {
    const response = await api.post('/auth/login', credentials);
    const { user, accessToken } = response.data.data;

    // Populate global Zustand store
    useAuthStore.getState().setAuth(user, accessToken);
    return user;
  },

  register: async (data: Record<string, unknown>) => {
    const response = await api.post('/auth/register', data);
    const { user, accessToken } = response.data.data;

    useAuthStore.getState().setAuth(user, accessToken);
    return user;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      useAuthStore.getState().clearAuth();
    }
  },
};
