import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePatientTreatmentPlans() {
  return useQuery({
    queryKey: ["patientTreatmentPlans"],
    queryFn: () => apiClient.treatmentPlans.getPatient(),
    staleTime: 30_000,   // 30 seconds — reuse cache on quick revisits
    retry: 1,            // only retry once instead of the default 3
  });
}

export function useDentistTreatmentPlans() {
  return useQuery({
    queryKey: ["dentistTreatmentPlans"],
    queryFn: () => apiClient.treatmentPlans.getDentist(),
  });
}

export function useTreatmentPlanById(id: string | number) {
  return useQuery({
    queryKey: ["treatmentPlan", id],
    queryFn: () => apiClient.treatmentPlans.getById(id),
    enabled: !!id,
  });
}

export function useProposeTreatmentPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { consultationId: string; notes?: string; procedures: Array<{ name: string; price: number; notes?: string }> }) =>
      apiClient.treatmentPlans.propose(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistTreatmentPlans"] });
      queryClient.invalidateQueries({ queryKey: ["patientTreatmentPlans"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
    },
  });
}

export function useTreatmentPlanDecision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { action: "ACCEPT" | "REJECT" } }) =>
      apiClient.treatmentPlans.decision(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientTreatmentPlans"] });
      queryClient.invalidateQueries({ queryKey: ["dentistTreatmentPlans"] });
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
    },
  });
}
