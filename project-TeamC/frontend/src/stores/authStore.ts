import { create } from "zustand";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher";
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthLoading: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  setAuthLoading: (isAuthLoading: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthLoading: true,
  setAuth: (token, user) => set({ token, user }),
  setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),
  logout: () => set({ token: null, user: null }),
}));
