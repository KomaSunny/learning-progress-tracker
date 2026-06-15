import Link from "next/link";

export default function LogoutPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-4 text-center">
      <h1 className="mb-4 text-2xl font-bold">ログアウトしました</h1>
      <p className="mb-6 text-sm text-gray-600">
        再度利用する場合はログインしてください。
      </p>
      <Link className="rounded bg-blue-600 px-4 py-2 text-white" href="/login">
        ログイン画面へ
      </Link>
    </main>
  );
}
