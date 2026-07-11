import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePatientConsultations() {
  return useQuery({
    queryKey: ["patientConsultations"],
    queryFn: () => apiClient.consultations.getPatientConsultations(),
    staleTime: 30_000,   // 30 seconds — reuse cache on quick revisits
    retry: 1,            // only retry once instead of the default 3
  });
}

export function useDentistConsultations() {
  return useQuery({
    queryKey: ["dentistConsultations"],
    queryFn: () => apiClient.consultations.getDentistConsultations(),
  });
}

export function useRespondToConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { action: "ACCEPT" | "REJECT"; responseNote?: string } }) =>
      apiClient.consultations.respond(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
    },
  });
}

export function useScheduleConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { scheduledDate: string; scheduledTime: string; timezone: string } }) =>
      apiClient.consultations.schedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
    },
  });
}

export function useCancelConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { reason?: string } }) =>
      apiClient.consultations.cancel(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
    },
  });
}

export function useRescheduleConsultation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { newDate: string; newTime: string; timezone: string } }) =>
      apiClient.consultations.reschedule(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
    },
  });
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: { requestStatus: string } }) =>
      apiClient.consultations.updateStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientConsultations"] });
      queryClient.invalidateQueries({ queryKey: ["dentistConsultations"] });
    },
  });
}

export function useLiveKitToken(id: string | number, enabled = false) {
  return useQuery({
    queryKey: ["livekitToken", id],
    queryFn: () => apiClient.consultations.getLiveKitToken(id),
    enabled: enabled && !!id,
  });
}
