import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/trees");

  // Check for session cookie
  const sessionToken = request.cookies.get("next-auth.session-token") ||
                       request.cookies.get("__Secure-next-auth.session-token");

  // Redirect to login if trying to access protected route without session
  if (isProtectedRoute && !sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to dashboard if trying to access auth pages while logged in
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
