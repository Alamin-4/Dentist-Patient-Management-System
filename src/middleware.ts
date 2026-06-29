import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper to decode JWT token payload in Next.js Edge Runtime
function decodeJwt(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve access tokens from cookies
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  let user: any = null;

  // 1. Try decoding the user locally from JWT token (super fast, zero network overhead)
  if (accessToken) {
    const decoded = decodeJwt(accessToken);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      user = {
        role: decoded.role,
        email: decoded.email,
        name: decoded.name,
      };
    }
  }

  // 2. Fall back to calling the backend session API if JWT isn't present/expired.
  // IMPORTANT: After Google OAuth, no custom accessToken cookie is set — only the
  // Better-Auth session cookie. So we trigger the fallback on sessionToken alone too.
  if (!user && (sessionToken || accessToken)) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      // CRITICAL: We forward User-Agent and IP headers to avoid triggering the backend
      // session fingerprint mismatch security check which deletes the user's session!
      const response = await fetch(`${baseUrl}/api/v1/auth/current-user-session`, {
        headers: {
          Cookie: request.headers.get("cookie") || "",
          "User-Agent": request.headers.get("user-agent") || "",
          "X-Forwarded-For": request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || (request as any).ip || "",
        },
      });

      if (response.ok) {
        const result = await response.json();
        user = result?.user || result?.data?.user;
      }
    } catch (e) {
      console.error("Session verification failed in middleware:", e);
    }
  }

  const userRole = user?.role;

  // 1. Admin Portal Protection
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // if (!user) {
    //   // Direct unauthenticated users to the admin login page
    //   const url = new URL("/admin-login", request.url);
    //   return NextResponse.redirect(url);
    // }
    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      // Rewrite unauthorized users to the error page, keeping URL in the address bar
      const url = new URL("/unauthorized", request.url);
      return NextResponse.rewrite(url);
    }
  }

  // 2. Dentist Portal Protection
  if (pathname === "/dentist" || pathname.startsWith("/dentist/")) {
    if (!user || userRole !== "DENTIST") {
      const url = new URL("/unauthorized", request.url);
      return NextResponse.rewrite(url);
    }
  }

  // 3. Patient Portal Protection
  if (pathname === "/patient" || pathname.startsWith("/patient/")) {
    if (!user || userRole !== "PATIENT") {
      const url = new URL("/unauthorized", request.url);
      return NextResponse.rewrite(url);
    }
  }

  // 4. Redirect Authenticated Users Away From Guest / Auth Pages
  if (user && userRole) {
    if (pathname === "/admin-login") {
      if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
        const url = new URL("/admin", request.url);
        return NextResponse.redirect(url);
      } else if (userRole === "DENTIST") {
        const url = new URL("/dentist", request.url);
        return NextResponse.redirect(url);
      } else if (userRole === "PATIENT") {
        const url = new URL("/patient", request.url);
        return NextResponse.redirect(url);
      }
    }
    if (pathname === "/register-doctor" && userRole === "DENTIST") {
      const url = new URL("/dentist/profile", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dentist/:path*",
    "/patient/:path*",
    "/admin-login",
    "/register-doctor",
  ],
};
