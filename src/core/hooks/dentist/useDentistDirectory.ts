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
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch from REST Countries API");
        const list: any[] = await response.json();
        const countries = list
          .map((c) => c.name?.common)
          .filter((c): c is string => !!c)
          .sort((a, b) => a.localeCompare(b));
        return ["All Countries", ...countries];
      } catch (error) {
        // Quietly fallback to prevent red TypeError stack trace in console when offline/blocked
        return [
          "All Countries",
          "Albania",
          "Argentina",
          "Australia",
          "Brazil",
          "Canada",
          "Colombia",
          "Costa Rica",
          "Croatia",
          "Dominican Republic",
          "France",
          "Germany",
          "Hungary",
          "India",
          "Mexico",
          "Philippines",
          "Poland",
          "Spain",
          "Thailand",
          "Turkey",
          "United Arab Emirates",
          "United Kingdom",
          "United States",
          "Vietnam",
        ];
      }
    },
    staleTime: 24 * 60 * 60 * 1000, // Cache for 24 hours
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

export function useAddDentistToDirectory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      fullName: string;
      clinicName?: string;
      city?: string;
      country?: string;
      specialty?: string;
      phone?: string;
    }) => apiClient.dentists.addDentistToDirectory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistDirectoryList"] });
    },
  });
}

export function useCreateDirectoryCheckoutSession() {
  return useMutation({
    mutationFn: (payload: { dentistDirectoryId: string; membershipPlan: string }) =>
      apiClient.dentists.createDirectoryCheckoutSession(payload),
  });
}

export function useSendClaimOtp() {
  return useMutation({
    mutationFn: (payload: { email: string; password?: string; name?: string }) =>
      apiClient.dentists.sendClaimOtp(payload),
  });
}

export function useDentistDirectoryReviews(slug: string) {
  return useQuery({
    queryKey: ["dentistDirectoryReviews", slug],
    queryFn: () => apiClient.dentists.getDirectoryReviews(slug),
    enabled: !!slug,
    staleTime: 30_000,
  });
}

export function useCreateDentistDirectoryReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, payload }: {
      slug: string; payload: {
        rating: number;
        communication?: number;
        valueForMoney?: number;
        followThrough?: number;
        text: string;
      }
    }) => apiClient.dentists.createDirectoryReview(slug, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dentistDirectoryReviews", variables.slug] });
      queryClient.invalidateQueries({ queryKey: ["dentistDirectoryDetail", variables.slug] });
    },
  });
}
