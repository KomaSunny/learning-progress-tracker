"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/components/Loading";
import { useAuthStore } from "@/stores/authStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);

  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.replace("/login");
    }
  }, [isAuthLoading, router, token]);

  if (isAuthLoading) {
    return <Loading />;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
