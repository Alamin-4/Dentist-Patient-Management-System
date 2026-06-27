"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, CreateProcedurePayload } from "@/api/client";
import { useMe } from "../auth/useAuth";

// ─────────────────────────────────────────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────────────────────────────────────────
export const PROCEDURE_KEYS = {
  global: (search?: string) => ["procedures", "global", search] as const,
  dentist: ["procedures", "dentist"] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// useGlobalProcedures — Fetches the public catalog of all procedures.
//
// Public endpoint — no session required. Supports optional search filtering.
// Cached for 10 minutes since the global catalog rarely changes.
//
// Usage:
//   const { data, isLoading } = useGlobalProcedures('whitening');
//   const { data } = useGlobalProcedures(); // all procedures
// ─────────────────────────────────────────────────────────────────────────────
export function useGlobalProcedures(search?: string) {
  return useQuery({
    queryKey: PROCEDURE_KEYS.global(search),
    queryFn: async () => {
      const res = await apiClient.procedures.getGlobal(search);
      return res?.data ?? res ?? [];
    },
    staleTime: 10 * 60_000, // 10 min — global catalog changes infrequently
    gcTime: 20 * 60_000,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useDentistProcedures — DEPENDENT on useMe (authenticated dentist only).
//
// Only executes after useMe returns a valid user. This prevents unnecessary
// API calls for unauthenticated users or while the session is loading.
//
// Usage:
//   const { data, isLoading } = useDentistProcedures();
//   const procedures = data?.data ?? [];
// ─────────────────────────────────────────────────────────────────────────────
export function useDentistProcedures() {
  const { user } = useMe(); // Parent query

  return useQuery({
    queryKey: PROCEDURE_KEYS.dentist,
    queryFn: async () => {
      const res = await apiClient.procedures.getDentist();
      return res?.data ?? res ?? [];
    },
    enabled: !!user, // DEPENDENT: only fires when parent (useMe) returns a user
    staleTime: 2 * 60_000, // 2 min — dentist's own list can change frequently
    gcTime: 5 * 60_000,
    retry: 1,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useCreateDentistProcedure — Creates a new procedure on the dentist's profile.
//
// Automatically invalidates the dentist procedures cache on success.
//
// Usage:
//   const { mutate, isPending } = useCreateDentistProcedure();
//   mutate({ procedureName: 'Teeth Cleaning', price: 120, notes: '...' });
// ─────────────────────────────────────────────────────────────────────────────
export function useCreateDentistProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProcedurePayload) => {
      return await apiClient.procedures.createDentist(payload);
    },
    onSuccess: () => {
      // Refresh the dentist procedure list after creation
      queryClient.invalidateQueries({ queryKey: PROCEDURE_KEYS.dentist });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useDeleteDentistProcedure — Removes a procedure from the dentist's profile.
//
// Automatically invalidates the dentist procedures cache on success.
//
// Usage:
//   const { mutate, isPending } = useDeleteDentistProcedure();
//   mutate('procedure-id-here');
// ─────────────────────────────────────────────────────────────────────────────
export function useDeleteDentistProcedure() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      return await apiClient.procedures.deleteDentist(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROCEDURE_KEYS.dentist });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// useBulkUploadProcedures — Imports procedures from a CSV file.
//
// Automatically invalidates the dentist procedures cache on success.
//
// Usage:
//   const { mutate, isPending } = useBulkUploadProcedures();
//   const formData = new FormData();
//   formData.append('csvFile', file);
//   mutate(formData);
// ─────────────────────────────────────────────────────────────────────────────
export function useBulkUploadProcedures() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiClient.procedures.uploadCsv(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROCEDURE_KEYS.dentist });
    },
  });
}
