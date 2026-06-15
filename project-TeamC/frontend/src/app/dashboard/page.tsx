import { LogoutButton } from "@/components/LogoutButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">ダッシュボード</h1>
          <LogoutButton />
        </div>
        <p className="text-sm text-zinc-600">
          ログイン済みユーザー向けのページです。
        </p>
      </main>
    </ProtectedRoute>
  );
}
