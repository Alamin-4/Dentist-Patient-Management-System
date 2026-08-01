import axios from "axios";
import { normalizeApiError } from "./error-handler";
import posthog from "posthog-js";
import { getCookie, deleteCookie } from "cookies-next";
import { resetUserSession } from "@/lib/posthog-identity";

import { env } from "@/config/env";

const API_BASE_URL = env.NEXT_PUBLIC_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null) {
            searchParams.append(`${key}[${subKey}]`, String(subValue));
          }
        });
      }
      else if (Array.isArray(value)) {
        value.forEach((val) => {
          searchParams.append(key, String(val));
        });
      }
      else {
        searchParams.append(key, String(value));
      }
    });
    
    return searchParams.toString();
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getCookie("accessToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      const sessionId = posthog.get_session_id();
      if (sessionId) {
        config.headers["x-posthog-session-id"] = sessionId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Authentication/Authorization Failures (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const apiError = normalizeApiError(error);

    if (
      apiError.statusCode === 401 &&
      !error.config?.url?.includes("/auth/login") &&
      !error.config?.url?.includes("/auth/register")
    ) {
      if (typeof window !== "undefined") {
        resetUserSession();
        // Clear local session cookies
        deleteCookie("accessToken", { path: "/" });
        deleteCookie("better-auth.session_token", { path: "/" });
        deleteCookie("refreshToken", { path: "/" });
        document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        const pathname = window.location.pathname;

        if (pathname === "/admin" || pathname.startsWith("/admin/")) {
          window.location.href = "/admin-login";
          return Promise.reject(apiError);
        }

        if (
          pathname.startsWith("/dentist") ||
          pathname.startsWith("/patient")
        ) {
          window.dispatchEvent(
            new CustomEvent("auth:session-expired", {
              detail: { redirectTo: "/?session_token_required=true" },
            })
          );
        }
      }
    }

    return Promise.reject(apiError);
  }
);
