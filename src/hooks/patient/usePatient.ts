"use client";

import { apiClient } from "@/api/client";
import { PersonalizeDataPayload } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ─────────────────────────────────────────────────────────────────────────────
// useSubmitPersonalizationData — Submits patient personalization details.
//
// Usage:
//   const { mutate, isPending } = useSubmitPersonalizationData();
//   mutate({
//     firstName: "John",
//     lastName: "Doe",
//     gender: "MALE",
//     country: "Germany",
//     city: "Berlin",
//     insuranceProvider: "Techniker Krankenkasse",
//     preferredLanguage: "English",
//     treatmentGoals: ["Implant", "Whitening"],
//     isAnxious: true
//   });
// ─────────────────────────────────────────────────────────────────────────────
export function useSubmitPersonalizationData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PersonalizeDataPayload) => {
      return await apiClient.patients.personalizeData(payload);
    },
    onSuccess: () => {
      // Invalidate current auth session to sync the personalization state
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}
