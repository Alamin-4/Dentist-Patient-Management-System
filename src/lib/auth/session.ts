export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user?: unknown;
}

const ACCESS_TOKEN_KEY = "rateddocs_access_token";
const REFRESH_TOKEN_KEY = "rateddocs_refresh_token";
const USER_KEY = "rateddocs_user";

const canUseStorage = () => typeof window !== "undefined";

export function getAccessToken() {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionUser<TUser = unknown>() {
  if (!canUseStorage()) return null;

  const user = window.localStorage.getItem(USER_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user) as TUser;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);

  if (session.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }

  if (session.user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
}

export function clearAuthSession() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export const authStorageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  user: USER_KEY,
} as const;
