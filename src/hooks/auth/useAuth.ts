"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { IRegisterDentist, IRegisterPatient } from "./auth.validation";
import { LoginPayload } from "@/types/api";

const hasSessionCookie = (): boolean => {
    if (typeof document === 'undefined') return false;
    return document.cookie
        .split('; ')
        .some((item) =>
            item.startsWith('better-auth.session_token=') ||
            item.startsWith('accessToken=')
        );
};


export const AUTH_KEYS = {
    session: ["auth", "session"] as const,
    me: ["auth", "me"] as const,
};

export function useSession() {
    return useQuery({
        queryKey: AUTH_KEYS.session,
        queryFn: async () => {
            try {
                const res = await apiClient.auth.getSession();
                return res?.data || res;
            } catch (error: any) {
                if (error?.statusCode === 401 || error?.status === 401) {
                    return null;
                }
                throw error;
            }
        },
        retry: false,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export function useMe() {
    const sessionQuery = useSession();
    const user = sessionQuery.data?.user || sessionQuery.data?.data?.user || null;

    return {
        ...sessionQuery,
        user, // convenience accessor — avoids nested data?.data?.user in every component
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// useRegister — Handles patient and dentist registration.
//
// Usage:
//   const { registerMutation } = useRegister();
//   registerMutation.mutate({ role: 'PATIENT', email, password, confirm_password });
//   registerMutation.mutate({ role: 'DENTIST', first_name, last_name, email, ... });
// ─────────────────────────────────────────────────────────────────────────────
export function usePatientRegister() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IRegisterPatient) => {
            return await apiClient.patients.register(payload as IRegisterPatient)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        onError: (error) => {
            console.error("Registration error:", error);
        },
    });
}

export const useDentistRegister = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: IRegisterDentist) => {
            return await apiClient.dentists.register(payload as IRegisterDentist)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
        onError: (error) => {
            console.error("Registration error:", error);
        }
    })
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            return await apiClient.auth.login(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}



export function useAdminLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            return await apiClient.auth.loginAdmin(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

export function useOtpVerify() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { email: string; otp: string; }) => {
            return await apiClient.auth.verifyEmail({ email: payload.email, otp: payload.otp });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

export function useResendOtp() {
    return useMutation({
        mutationFn: async (payload: { email: string }) => {
            return await apiClient.auth.resendOtp(payload);
        },
    });
}


export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            return await apiClient.auth.logout();
        },
        onSuccess: () => {
            queryClient.clear();
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        },
    });
}

export function useGoogleLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params?: { returnTo?: string; hasCompare?: boolean }) => {
            apiClient.auth.initiateGoogleLogin(params?.returnTo, params?.hasCompare);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: AUTH_KEYS.session });
        },
    });
}


export default function useAuth() {
    const registerPatientMutation = usePatientRegister();
    const registerDentistMutation = useDentistRegister();
    const loginMutation = useLogin();
    const googleLoginMutation = useGoogleLogin();
    const otpVerifyMutation = useOtpVerify();
    const resendOtpMutation = useResendOtp();
    const logoutMutation = useLogout();
    const sessionQuery = useSession();

    return {
        registerPatientMutation,
        registerDentistMutation,
        loginMutation,
        googleLoginMutation,
        otpVerifyMutation,
        resendOtpMutation,
        logoutMutation,
        sessionQuery,

        // register loading
        isRegisterPatientLoading: registerPatientMutation.isPending,
        isRegisterDentistLoading: registerDentistMutation.isPending,
        isOtpResendLoading: resendOtpMutation.isPending,
        isOtpVerifyLoading: otpVerifyMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
        isGoogleLoginLoading: googleLoginMutation.isPending,

        // register error
        registerPatientError: registerPatientMutation.error,
        registerDentistError: registerDentistMutation.error,
        otpResendError: resendOtpMutation.error,
        otpVerifyError: otpVerifyMutation.error,
        logoutError: logoutMutation.error,
        googleLoginError: googleLoginMutation.error,
    };
}
