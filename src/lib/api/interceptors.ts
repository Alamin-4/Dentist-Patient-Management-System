import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";

import { clearAuthSession, getAccessToken } from "@/lib/auth/session";
import { normalizeApiError } from "./error-handler";

const UNAUTHORIZED_EVENT = "rateddocs:unauthorized";

export function dispatchUnauthorizedEvent() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

export function onUnauthorizedSession(callback: () => void) {
  if (typeof window === "undefined") return () => undefined;

  window.addEventListener(UNAUTHORIZED_EVENT, callback);

  return () => window.removeEventListener(UNAUTHORIZED_EVENT, callback);
}

export function attachInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const apiError = normalizeApiError(error);

      if (apiError.status === 401) {
        clearAuthSession();
        dispatchUnauthorizedEvent();
      }

      return Promise.reject(apiError);
    },
  );

  return client;
}
