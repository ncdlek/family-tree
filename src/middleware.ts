import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // Protect /dashboard and /trees routes
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/trees")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
