import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDentistDirectory(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["dentistDirectoryList", params],
    queryFn: () => apiClient.dentists.getDirectoryList(params),
    staleTime: 30_000,
  });
}

export function useDentistDirectoryDetail(slug: string, enabled = true) {
  return useQuery({
    queryKey: ["dentistDirectoryDetail", slug],
    queryFn: () => apiClient.dentists.getDirectoryDetail(slug),
    enabled: !!slug && enabled,
    staleTime: 30_000,
  });
}

export function useClaimDentistDirectoryProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: any }) =>
      apiClient.dentists.claimDirectoryProfile(slug, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dentistDirectoryDetail", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["dentistDirectoryList"] });
    },
  });
}

export function useRequestDirectoryConsultation() {
  return useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: any }) =>
      apiClient.dentists.requestDirectoryConsultation(slug, payload),
  });
}

export function useSimulateStripeWebhook() {
  return useMutation({
    mutationFn: (payload: any) => apiClient.dentists.simulateStripeWebhook(payload),
  });
}
