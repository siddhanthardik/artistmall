import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  roleName?: string;
  permissions?: string[];
  isSuperAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setAccessToken: (token: string) => void;
  setHydrated: (state: boolean) => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
      setAccessToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
      setHydrated: (state) => set({ isHydrated: state }),
      checkAuth: async () => {
        // This is usually handled by the axios interceptor on the first request
        // but can be explicitly called on app mount
        return !!get().accessToken;
      },
    }),
    {
      name: 'artistmall-auth-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: (persistedState: any) => ({
        ...persistedState,
        accessToken: null,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
