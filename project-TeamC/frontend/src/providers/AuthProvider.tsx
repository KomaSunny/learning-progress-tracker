"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useAuthStore, type AuthUser } from "@/stores/authStore";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAuthLoading = useAuthStore((state) => state.setAuthLoading);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    async function restoreAuth() {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        // Authorizationヘッダーは apiClient の request interceptor で
        // localStorage の access_token から自動付与される。
        const { data } = await apiClient.get<AuthUser>("/me");
        setAuth(token, data);
      } catch {
        localStorage.removeItem("access_token");
        logout();
      } finally {
        setAuthLoading(false);
      }
    }

    restoreAuth();
  }, [logout, setAuth, setAuthLoading]);

  return <>{children}</>;
}
