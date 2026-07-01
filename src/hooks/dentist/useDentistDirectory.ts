import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useDentistDirectory(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["dentistDirectoryList", JSON.stringify(params)],
    queryFn: () => apiClient.dentists.getDirectoryList(params),
    staleTime: 30_000,
    enabled: !!params,
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

// Country filter options are derived from real directory data instead of a
// hardcoded list, so newly imported/registered countries show up automatically.
export function useDirectoryCountries() {
  return useQuery({
    queryKey: ["dentistDirectoryCountries"],
    queryFn: async () => {
      const response = await apiClient.dentists.getDirectoryList({ limit: 500 });
      const list: any[] = response?.data ?? [];
      const countries = Array.from(
        new Set(list.map((d) => d.country).filter((c): c is string => !!c)),
      ).sort((a, b) => a.localeCompare(b));
      return ["All Countries", ...countries];
    },
    staleTime: 5 * 60_000,
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

export function useSendClaimOtp() {
  return useMutation({
    mutationFn: (payload: { email: string; password?: string; name?: string }) =>
      apiClient.dentists.sendClaimOtp(payload),
  });
}
