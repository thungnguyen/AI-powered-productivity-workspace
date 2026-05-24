import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  email: string;
  displayName: string;
  avatarUrl?: string | null;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'zennote-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
