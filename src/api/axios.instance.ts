import axios from "axios";
import { normalizeApiError } from "./error-handler";
import posthog from "posthog-js";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in environment variables");
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // ✅ ADD THIS: Custom params serializer for nested objects
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      
      // Handle nested objects like { price: { min: 100, max: 500 } }
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue !== undefined && subValue !== null) {
            searchParams.append(`${key}[${subKey}]`, String(subValue));
          }
        });
      } 
      // Handle arrays
      else if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(`${key}[]`, String(item));
        });
      } 
      // Handle primitives
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
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

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
        // Clear local session cookies
        document.cookie = "accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "better-auth.session_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

        const pathname = window.location.pathname;

        // Route admins, dentists, or patients to the home page sign-in
        if (
          pathname === "/admin" ||
          pathname.startsWith("/admin/") ||
          pathname.startsWith("/dentist") ||
          pathname.startsWith("/patient")
        ) {
          window.location.href = "/?session_token_required=true";
        }
      }
    }

    return Promise.reject(apiError);
  }
);
