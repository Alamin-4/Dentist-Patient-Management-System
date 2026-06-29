import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export interface Specialty {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

/**
 * Fetches the list of all active specialties from the backend.
 * Supports optional search filtering via query parameter.
 */
export function useSpecialties(search?: string) {
  return useQuery<Specialty[]>({
    queryKey: ["specialties", search],
    queryFn: async () => {
      const response = await apiClient.specialties.getSpecialties(search);
      // Backend returns { success, message, data } — extract the array
      return response?.data ?? response ?? [];
    },
    staleTime: 5 * 60_000, // Cache for 5 minutes — specialties rarely change
    retry: 1,
  });
}
