import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const requestUrl = error.config?.url ?? "";
      const isLoginRequest = requestUrl.includes("/auth/login");

      localStorage.removeItem("access_token");
      useAuthStore.getState().logout();

      if (!isLoginRequest) {
        window.location.replace(new URL("/login", window.location.origin));
      }
    }

    return Promise.reject(error);
  },
);
