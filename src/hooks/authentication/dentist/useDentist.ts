import { persistSession } from "@/hooks/shared/shared.function";
import {
  dentistApi,
  LoginPayload,
  OtpPayload,
  RegisterPayload,
} from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useDentistRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => dentistApi.register(data),
    onSuccess: persistSession,
  });
}

export function useDentistLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      dentistApi.login({ ...data, role: "DENTIST" }),
    onSuccess: persistSession,
  });
}

export function useDentistVerifyOtp() {
  return useMutation({
    mutationFn: (data: OtpPayload) => dentistApi.verifyOtp(data),
    onSuccess: persistSession,
  });
}

export function useOtpResend() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const { email } = payload;
      return dentistApi.resendOtp({ email });
    },
  });
}
