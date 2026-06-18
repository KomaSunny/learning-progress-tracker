import { NextResponse } from "next/server";

export function middleware() {
  // JWT is stored in LocalStorage, which middleware cannot read.
  // ProtectedRoute is responsible for the actual client-side auth guard.
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
