import { apiClient } from "@/api/client";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export default function useVerifications(params?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const verificationslist = useQuery({
    queryKey: ["verifications", params],
    queryFn: async () => {
      const res = await apiClient.admin.getDentistVerificationList(params);
      return res;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    verificationslist,
    isVerificationslistLoading: verificationslist.isLoading,
    isVerificationslistError: verificationslist.isError,
    isVerificationslistSuccess: verificationslist.isSuccess,
    verificationslistError: verificationslist.error,
    verificationslistData: verificationslist.data,
  };
}

export function useDentistVerificationPhases(dentistId: string | null) {
  return useQuery({
    queryKey: ["dentist-verification-phases", dentistId],
    queryFn: async () => {
      if (!dentistId) return null;
      const res = await apiClient.admin.getDentistVerificationPhases(dentistId);
      return res.data;
    },
    enabled: !!dentistId,
    staleTime: 1000 * 10,
  });
}

export function useVerifyPhase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      dentistId,
      phase,
      isApproved,
      note,
    }: {
      dentistId: string;
      phase: "ph1" | "ph2" | "ph3";
      isApproved: boolean;
      note: string;
    }) => {
      return await apiClient.admin.verifyPhase(dentistId, { phase, isApproved, note });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["verifications"] });
      queryClient.invalidateQueries({ queryKey: ["dentist-verification-phases", variables.dentistId] });
    },
  });
}