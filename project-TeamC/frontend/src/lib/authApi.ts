import { apiClient } from "@/lib/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  user: {
    id: string;
    name: string;
    role: "student" | "teacher";
  };
};

export async function loginApi(payload: LoginRequest) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}
