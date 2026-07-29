import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/api/queryKeys";
import { dentistService } from "@/services/dentistService";
import { mapApiDentist, type Dentist } from "@/features/marketing/find-dentists-page-components/types";

export interface UseDentistComparisonProps {
  selectedDentistId?: string | null;
  dentistsToCompare?: Dentist[];
  isPostBooking?: boolean;
  enabled?: boolean;
}

export function useDentistComparison({
  selectedDentistId,
  dentistsToCompare = [],
  enabled = true,
}: UseDentistComparisonProps) {
  const selectedDentistQuery = useQuery({
    queryKey: queryKeys.dentists.comparison(selectedDentistId ? [selectedDentistId] : []),
    queryFn: async () => {
      if (!selectedDentistId) return [];
      const res = await dentistService.getDirectoryList({ ids: [selectedDentistId] });
      return (res?.data ?? []).map(mapApiDentist);
    },
    enabled: enabled && !!selectedDentistId && dentistsToCompare.length === 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const otherDentistsQuery = useQuery({
    queryKey: queryKeys.dentists.list({ limit: 12 }),
    queryFn: async () => {
      const res = await dentistService.getDirectoryList({ limit: 12 });
      return (res?.data ?? []).map(mapApiDentist);
    },
    enabled: enabled && dentistsToCompare.length === 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const isLoading = selectedDentistQuery.isLoading || otherDentistsQuery.isLoading;
  const isError = selectedDentistQuery.isError || otherDentistsQuery.isError;
  const error = selectedDentistQuery.error || otherDentistsQuery.error;

  return {
    selectedDentist: selectedDentistQuery.data?.[0] || null,
    otherDentists: otherDentistsQuery.data || [],
    isLoading,
    isError,
    error,
    refetch: () => {
      if (selectedDentistId) {
        selectedDentistQuery.refetch();
      }
      otherDentistsQuery.refetch();
    },
  };
}
