import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL, endpoints } from "@/lib/api/endpoints";
import {
  LOGIN_PATH_BY_ROLE,
  normalizeRole,
  ROLE_HOME,
  type UserRole,
} from "@/lib/auth/roles";

type VerifyResult =
  | { status: "valid"; role: UserRole }
  | { status: "invalid" }
  | { status: "unavailable" };

interface VerifyTokenResponse {
  success?: boolean;
  message?: string;
  data?: {
    user_id?: number;
    email?: string;
    type?: string;
  };
}

const ACCESS_TOKEN_COOKIE = "rateddocs_access_token";
const USER_COOKIE = "rateddocs_user";

const ROUTE_ROLE: Array<{ prefix: string; role: UserRole }> = [
  { prefix: "/admin", role: "ADMIN" },
  { prefix: "/dentist", role: "DENTIST" },
  { prefix: "/patient", role: "PATIENT" },
];

const PUBLIC_AUTH_PATHS = new Set([
  "/admin-login",
  "/doctor-login",
  "/register-doctor",
]);

function getRequiredRole(pathname: string) {
  return ROUTE_ROLE.find(({ prefix }) => pathname.startsWith(prefix))?.role;
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  return atob(padded);
}

function getRoleFromToken(token: string) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const decoded = JSON.parse(decodeBase64Url(payload)) as {
      type: string;
      user_id: number;
      email: string;
    };

    return normalizeRole(decoded.type);
  } catch {
    return null;
  }
}

function getRoleFromUserCookie(request: NextRequest) {
  const userCookie = request.cookies.get(USER_COOKIE)?.value;
  if (!userCookie) return null;

  try {
    const user = JSON.parse(decodeURIComponent(userCookie)) as {
      type: string;
      email: string;
      user_id: number;
    };

    return normalizeRole(user.type);
  } catch {
    return null;
  }
}

function getFallbackRole(request: NextRequest, token: string) {
  return getRoleFromUserCookie(request) ?? getRoleFromToken(token);
}

async function verifyToken(token: string): Promise<VerifyResult> {
  
  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoints.auth.verifyToken}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) return { status: "invalid" };

    const payload = (await response.json()) as VerifyTokenResponse;
    if (payload.success === false) return { status: "invalid" };

    const role = normalizeRole(payload.data?.type);

    if (!role) return { status: "unavailable" };

    return { status: "valid", role };
  } catch {
    return { status: "unavailable" };
  }
}

function resolveRoleAccess(
  request: NextRequest,
  role: UserRole,
  requiredRole?: UserRole,
) {
  if (PUBLIC_AUTH_PATHS.has(request.nextUrl.pathname)) {
    return redirectTo(request, ROLE_HOME[role]);
  }

  if (requiredRole && role !== requiredRole) {
    return redirectTo(request, ROLE_HOME[role]);
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const isPublicAuthRoute = PUBLIC_AUTH_PATHS.has(pathname);
  const requiredRole = isPublicAuthRoute
    ? undefined
    : getRequiredRole(pathname);

  if (!requiredRole && !isPublicAuthRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (requiredRole) {
      return redirectTo(request, LOGIN_PATH_BY_ROLE[requiredRole]);
    }

    return NextResponse.next();
  }

  const fallbackRole = getFallbackRole(request, token);
  const tokenVerification = await verifyToken(token);

  if (tokenVerification.status === "invalid") {
    return requiredRole
      ? redirectTo(request, LOGIN_PATH_BY_ROLE[requiredRole])
      : NextResponse.next();
  }

  if (tokenVerification.status === "unavailable") {
    if (fallbackRole) {
      return resolveRoleAccess(request, fallbackRole, requiredRole);
    }

    return requiredRole
      ? redirectTo(request, LOGIN_PATH_BY_ROLE[requiredRole])
      : NextResponse.next();
  }

  return resolveRoleAccess(request, tokenVerification.role, requiredRole);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)"],
};
