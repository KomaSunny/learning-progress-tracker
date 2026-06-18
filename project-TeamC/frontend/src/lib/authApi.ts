import { apiClient } from "@/lib/api";
import type { AuthUser } from "@/stores/authStore";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
};

export async function loginApi(payload: LoginRequest) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function fetchMe() {
  const { data } = await apiClient.get<AuthUser>("/me");
  return data;
}
