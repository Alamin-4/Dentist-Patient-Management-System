import { useMutation } from "@tanstack/react-query";

import { type ApiResponse } from "@/lib/api/client";
import {
  patientApi,
  type AuthResult,
  type LoginPayload,
  type OtpPayload,
  type RegisterPayload,
  type ResendOtpPayload,
} from "@/lib/api/services";
import { persistSession } from "@/hooks/shared/shared.function";

export function usePatientRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      patientApi.register({ ...data, role: "PATIENT" }),
    onSuccess: persistSession,
  });
}

export function usePatientLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      patientApi.login({ ...data, role: "PATIENT" }),
    onSuccess: persistSession,
  });
}

export function usePatientVerifyOtp() {
  return useMutation({
    mutationFn: (data: OtpPayload) => patientApi.verifyOtp(data),
    onSuccess: persistSession,
  });
}

export function usePatientVerifyEmailOtp() {
  return usePatientVerifyOtp();
}

export function usePatientResendOtp() {
  return useMutation({
    mutationFn: (data: ResendOtpPayload) => patientApi.resendOtp(data),
  });
}
