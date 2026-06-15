"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@/components/ErrorMessage";
import { loginApi } from "@/lib/authApi";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isAuthLoading && token) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, router, token]);

  async function onSubmit(values: LoginFormValues) {
    setErrorMessage("");

    try {
      const result = await loginApi(values);
      localStorage.setItem("access_token", result.access_token);
      setAuth(result.access_token, result.user);
      router.push("/dashboard");
    } catch {
      setErrorMessage("ログインに失敗しました");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold">ログイン</h1>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="block">
          <span className="text-sm font-medium">メールアドレス</span>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <ErrorMessage message={errors.email.message ?? ""} />}
        </label>

        <label className="block">
          <span className="text-sm font-medium">パスワード</span>
          <input
            className="mt-1 w-full rounded border px-3 py-2"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <ErrorMessage message={errors.password.message ?? ""} />
          )}
        </label>

        {errorMessage && <ErrorMessage message={errorMessage} />}

        <button
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "ログイン中..." : "ログイン"}
        </button>
      </form>
    </main>
  );
}
