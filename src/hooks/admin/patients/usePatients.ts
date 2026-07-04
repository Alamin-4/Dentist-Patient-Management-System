import { apiClient } from "@/api/client";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

export default function usePatients(params?: {
  status?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const patientslist = useQuery({
    queryKey: ["patients", params],
    queryFn: async () => {
      const res = await apiClient.admin.getPatientsList(params);
      return res;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    patientslist,
    isPatientslistLoading: patientslist.isLoading,
    isPatientslistError: patientslist.isError,
    isPatientslistSuccess: patientslist.isSuccess,
    patientslistError: patientslist.error,
    patientslistData: patientslist.data,
  };
}

export function usePatientDetail(id: string) {
  return useQuery({
    queryKey: ["patient-detail", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.admin.getPatientDetail(id);
      return res;
    },
    enabled: !!id,
    staleTime: 1000 * 10,
  });
}
