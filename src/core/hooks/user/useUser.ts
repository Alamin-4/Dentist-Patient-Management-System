"use client";

import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const USER_KEYS = {
  me: ["user", "me"] as const,
};

export function useGetMe() {
  return useQuery({
    queryKey: USER_KEYS.me,
    queryFn: async () => {
      return await apiClient.users.getMe();
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await apiClient.users.updatePatientProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useUpdateDentistProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await apiClient.users.updateDentistProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      return await apiClient.users.updateAdminProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.me });
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: any) => {
      return await apiClient.users.changePassword(payload);
    },
  });
}
