"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export function LogoutButton() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.logout);

  function handleLogout() {
    localStorage.removeItem("access_token");
    clearAuth();
    router.push("/logout");
  }

  return (
    <button
      className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      type="button"
      onClick={handleLogout}
    >
      ログアウト
    </button>
  );
}
