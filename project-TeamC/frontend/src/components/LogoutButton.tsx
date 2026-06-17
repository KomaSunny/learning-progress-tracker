"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    router.push("/logout");
  }

  return (
    <button
      className="rounded bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      type="button"
      onClick={handleLogout}
    >
      {"\u30ed\u30b0\u30a2\u30a6\u30c8"}
    </button>
  );
}
