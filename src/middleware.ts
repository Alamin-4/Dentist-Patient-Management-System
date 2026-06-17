import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rateddocs_access_token")?.value;

  const isProtectedRoute =
    pathname.startsWith("/dentist") ||
    pathname.startsWith("/patient") ||
    pathname.startsWith("/admin");

  // 👇 Exclude the admin login page from being treated as a protected route
  const isPublicRoute = pathname === "/admin-login";

  if (isProtectedRoute && !isPublicRoute && !token) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)"],
};
