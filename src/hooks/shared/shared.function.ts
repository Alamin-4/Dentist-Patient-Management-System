import { ApiResponse, AuthResult } from "@/lib/api";
import { setAuthSession } from "@/lib/auth/session";

export const getAuthPayload = (response: ApiResponse<AuthResult> | AuthResult) => {
  return "data" in response ? response.data : response;
};

export const persistSession = (response: ApiResponse<AuthResult> | AuthResult) => {
  const payload = getAuthPayload(response);
  const accessToken = payload.access ?? payload.accessToken ?? payload.token;

  if (accessToken) {
    setAuthSession({
      accessToken,
      refreshToken: payload.refresh ?? payload.refreshToken,
      user: payload.user,
    });
  }

  return response;
};
