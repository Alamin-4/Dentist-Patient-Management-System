import { apiClient } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export default function useOverview() {
  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      const res = await apiClient.admin.getOverview();
      return res;
    },
    staleTime: 1000 * 30, // 30 seconds stale time
    gcTime: 1000 * 60 * 5, // 5 minutes gc time
    retry: 1,
  });

  return {
    overviewQuery,
    isLoading: overviewQuery.isLoading,
    isError: overviewQuery.isError,
    data: overviewQuery.data?.data,
    error: overviewQuery.error,
  };
}
