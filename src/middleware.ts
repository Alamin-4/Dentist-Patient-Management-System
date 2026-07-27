import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/constants";
import { env } from "@/config/env";

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

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  let user: any = null;
  let hasInvalidCookies = false;

  if (sessionToken || accessToken) {
    try {
      const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

      const response = await fetch(`${baseUrl}/auth/current-user-session`, {
        headers: {
          Cookie: request.headers.get("cookie") || "",
          "User-Agent": request.headers.get("user-agent") || "",
          "X-Forwarded-For":
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            (request as any).ip ||
            "",
        },
      });

      if (response.ok) {
        const result = await response.json();
        user = result?.user || result?.data?.user;
      } else if (response.status === 401 || response.status === 403 || response.status === 404) {
        hasInvalidCookies = true;
      }
    } catch (e) {
      console.error("Session verification failed in middleware:", e);
    }
  }

  if (!user && accessToken && !hasInvalidCookies) {
    const decoded = decodeJwt(accessToken);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      user = {
        role: decoded.role,
        email: decoded.email,
        name: decoded.name,
      };
    }
  }

  const setNoCacheHeaders = (res: NextResponse) => {
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
    return res;
  };

  const attachCookieCleanup = (res: NextResponse) => {
    if (hasInvalidCookies) {
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      res.cookies.delete("better-auth.session_token");
      res.cookies.delete("__Secure-better-auth.session_token");
    }
    return setNoCacheHeaders(res);
  };

  const userRole = user?.role;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!user) {
      const url = new URL("/admin-login", request.url);
      return attachCookieCleanup(NextResponse.redirect(url));
    }
    if (userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN) {
      if (userRole === UserRole.DENTIST) {
        return attachCookieCleanup(NextResponse.redirect(new URL("/dentist", request.url)));
      }
      if (userRole === UserRole.PATIENT) {
        return attachCookieCleanup(NextResponse.redirect(new URL("/patient", request.url)));
      }
      const url = new URL("/admin-login", request.url);
      return attachCookieCleanup(NextResponse.redirect(url));
    }
  }

  if (pathname === "/dentist" || pathname.startsWith("/dentist/")) {
    if (!user) {
      const url = new URL("/register-doctor", request.url);
      return attachCookieCleanup(NextResponse.redirect(url));
    }
    if (userRole !== UserRole.DENTIST) {
      if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
        return attachCookieCleanup(NextResponse.redirect(new URL("/admin", request.url)));
      }
      if (userRole === UserRole.PATIENT) {
        return attachCookieCleanup(NextResponse.redirect(new URL("/patient", request.url)));
      }
      const url = new URL("/register-doctor", request.url);
      return attachCookieCleanup(NextResponse.redirect(url));
    }
  }

  if (pathname === "/patient" || pathname.startsWith("/patient/")) {
    if (!user) {
      const url = new URL("/", request.url);
      return attachCookieCleanup(NextResponse.redirect(url));
    }
    if (userRole !== UserRole.PATIENT) {
      if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
        return attachCookieCleanup(NextResponse.redirect(new URL("/admin", request.url)));
      }
      if (userRole === UserRole.DENTIST) {
        return attachCookieCleanup(NextResponse.redirect(new URL("/dentist", request.url)));
      }
      const url = new URL("/", request.url);
      return attachCookieCleanup(NextResponse.redirect(url));
    }
  }

  if (user && userRole) {
    if (pathname === "/admin-login") {
      if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
        const url = new URL("/admin", request.url);
        return attachCookieCleanup(NextResponse.redirect(url));
      } else if (userRole === UserRole.DENTIST) {
        const url = new URL("/dentist", request.url);
        return attachCookieCleanup(NextResponse.redirect(url));
      } else if (userRole === UserRole.PATIENT) {
        const url = new URL("/patient", request.url);
        return attachCookieCleanup(NextResponse.redirect(url));
      }
    }
    if (pathname === "/register-doctor") {
      if (userRole === UserRole.PATIENT) {
        const url = new URL("/patient", request.url);
        return attachCookieCleanup(NextResponse.redirect(url));
      } else if (userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN) {
        const url = new URL("/admin", request.url);
        return attachCookieCleanup(NextResponse.redirect(url));
      } else if (userRole === UserRole.DENTIST) {
        const dentistStep = request.nextUrl.searchParams.get("dentist");
        if (dentistStep !== "professional-info") {
          const url = new URL("/dentist/profile", request.url);
          return attachCookieCleanup(NextResponse.redirect(url));
        }
      }
    }
  }

  // Create the final response
  const response = attachCookieCleanup(NextResponse.next());

  // Add headers to completely disable browser caching for protected routes
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
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