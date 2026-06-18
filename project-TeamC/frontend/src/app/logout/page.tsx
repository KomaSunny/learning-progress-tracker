"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function LogoutPage() {
  const clearAuth = useAuthStore((state) => state.logout);

  useEffect(() => {
    localStorage.removeItem("access_token");
    clearAuth();
  }, [clearAuth]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">
        {"\u30ed\u30b0\u30a2\u30a6\u30c8\u3057\u307e\u3057\u305f"}
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        {"\u518d\u5ea6\u5229\u7528\u3059\u308b\u5834\u5408\u306f\u30ed\u30b0\u30a4\u30f3\u3057\u3066\u304f\u3060\u3055\u3044\u3002"}
      </p>
      <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/login">
        {"\u30ed\u30b0\u30a4\u30f3\u753b\u9762\u3078"}
      </Link>
    </main>
  );
}
