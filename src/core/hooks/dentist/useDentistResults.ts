import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { resultService } from "@/services/resultService";
import { fileService } from "@/services/fileService";

export interface CreateDentistResultMutationPayload {
  title: string;
  patientName: string;
  date: string;
  location: string;
  beforeImageFile: File;
  afterImageFile: File;
}

export function useDentistResults() {
  const queryClient = useQueryClient();

  const resultsQuery = useQuery({
    queryKey: queryKeys.results.list(),
    queryFn: async () => {
      const response = await resultService.getDentistResults();
      const apiData = response?.data || response;
      return Array.isArray(apiData) ? apiData : [];
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const createResultMutation = useMutation({
    mutationFn: async (payload: CreateDentistResultMutationPayload) => {
      const beforeUploadRes = await fileService.upload(payload.beforeImageFile);
      const beforeUrl = beforeUploadRes?.data?.secure_url || beforeUploadRes?.secure_url;
      if (!beforeUrl) throw new Error("Failed to upload before image");

      const afterUploadRes = await fileService.upload(payload.afterImageFile);
      const afterUrl = afterUploadRes?.data?.secure_url || afterUploadRes?.secure_url;
      if (!afterUrl) throw new Error("Failed to upload after image");

      return await resultService.createDentistResult({
        title: payload.title,
        patientName: payload.patientName,
        date: payload.date,
        location: payload.location,
        beforeImage: beforeUrl,
        afterImage: afterUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.results.list() });
    },
  });

  return {
    results: resultsQuery.data || [],
    isLoading: resultsQuery.isLoading,
    isError: resultsQuery.isError,
    refetch: resultsQuery.refetch,
    createMutation: createResultMutation,
  };
}
