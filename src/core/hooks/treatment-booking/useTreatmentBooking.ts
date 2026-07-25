import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTreatmentBookings(statusFilter?: string) {
  return useQuery({
    queryKey: ["treatmentBookings", statusFilter],
    queryFn: () => apiClient.treatmentBookings.list(statusFilter),
    staleTime: 10_000,
  });
}

export function useTreatmentBookingById(id: string) {
  return useQuery({
    queryKey: ["treatmentBooking", id],
    queryFn: () => apiClient.treatmentBookings.getById(id),
    enabled: !!id,
    staleTime: 5_000,
  });
}

export function useCreateEscrowSession() {
  return useMutation({
    mutationFn: (bookingId: string) => apiClient.treatmentBookings.createEscrowSession(bookingId),
    onSuccess: (data) => {
      if (data?.data?.url) {
        window.location.href = data.data.url;
      }
    },
  });
}

export function useVerifyArrivalCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, arrivalCode }: { id: string; arrivalCode: string }) =>
      apiClient.treatmentBookings.verifyArrival(id, arrivalCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentBooking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["treatmentBookings"] });
    },
  });
}

export function useSubmitFinalPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        procedures: Array<{ name: string; price: number; notes?: string }>;
        notes?: string;
      };
    }) => apiClient.treatmentBookings.submitFinalPlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentBooking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["treatmentBookings"] });
    },
  });
}

export function useRespondFinalPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { action: "APPROVE" | "REJECT"; reason?: string };
    }) => apiClient.treatmentBookings.respondFinalPlan(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentBooking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["treatmentBookings"] });
    },
  });
}

export function useVerifyPaymentCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentCode }: { id: string; paymentCode: string }) =>
      apiClient.treatmentBookings.verifyPayment(id, paymentCode),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentBooking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["treatmentBookings"] });
    },
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        ratingCommunication: number;
        ratingValueForMoney: number;
        ratingFollowThrough: number;
        comments: string;
        afterPhotoUrl?: string;
      };
    }) => apiClient.treatmentBookings.submitReview(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["treatmentBooking", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["treatmentBookings"] });
      queryClient.invalidateQueries({ queryKey: ["treatmentPlan"] });
      queryClient.invalidateQueries({ queryKey: ["patientTreatmentPlans"] });
    },
  });
}
