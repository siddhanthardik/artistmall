import { api } from './api';
import { useAuthStore } from '../store/authStore';

export const AdminAuthService = {
  login: async (credentials: Record<string, unknown>) => {
    // Phase 4 & 8: Deterministic Login Logic
    const response = await api.post('/admin/auth/login', credentials);
    const { user, accessToken } = response.data.data;

    // Phase 7: Proper Hydration & Persistence
    useAuthStore.getState().setAuth(user, accessToken);

    return { user, accessToken };
  },

  refresh: async () => {
    const response = await api.post('/admin/auth/refresh');
    const { accessToken } = response.data.data;
    useAuthStore.getState().setAccessToken(accessToken);
    return accessToken;
  },

  logout: async () => {
    try {
      await api.post('/admin/auth/logout');
    } finally {
      useAuthStore.getState().clearAuth();
      // Hard clear to prevent state leakage
      localStorage.removeItem('artistmall-auth-storage');
      window.location.href = '/admin/login';
    }
  },
};
