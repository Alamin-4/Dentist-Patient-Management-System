import { apiClient } from '@/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Optional: Define a base type for your data to get better TypeScript autocomplete
export type Specialty = {
    id: string | number;
    name: string;
    slug: string;
    description?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

/**
 * Hook to fetch a list of specialties (with optional search)
 */
export const useSpecialties = (search?: string) => {
    return useQuery<Specialty[]>({
        queryKey: ['specialties', { search }],
        queryFn: async () => {
            const res = await apiClient.specialties.getSpecialties(search);
            return res?.data ?? res ?? [];
        },
        // Keeps data fresh for 5 minutes (adjust as needed)
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Hook to fetch a single specialty by its slug
 */
export const useSpecialtyBySlug = (slug: string) => {
    return useQuery<Specialty>({
        queryKey: ['specialties', 'detail', slug],
        queryFn: async () => {
            const res = await apiClient.specialties.getBySlug(slug);
            return res?.data ?? res;
        },
        // Only run the query if a slug is actually provided
        enabled: !!slug,
    });
};

/**
 * Hook to create a new specialty
 */
export const useCreateSpecialty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { name: string; description?: string }) =>
            apiClient.specialties.create(payload),
        onSuccess: () => {
            // Invalidate the list query to trigger a refetch and show the new item
            queryClient.invalidateQueries({ queryKey: ['specialties'] });
        },
    });
};

/**
 * Hook to update an existing specialty
 */
export const useUpdateSpecialty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // We pass both id and payload to the mutation function
        mutationFn: ({ id, payload }: { id: string | number; payload: { name?: string; description?: string } }) =>
            apiClient.specialties.update(id, payload),
        onSuccess: () => {
            // Invalidate both the list and the specific detail queries
            queryClient.invalidateQueries({ queryKey: ['specialties'] });
        },
    });
};

/**
 * Hook to delete a specialty
 */
export const useDeleteSpecialty = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string | number) => apiClient.specialties.delete([id]),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specialties'] });
        },
    });
};

/**
 * Hook to delete multiple specialties
 */
export const useBulkDeleteSpecialties = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ids: Array<string | number>) => apiClient.specialties.delete(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specialties'] });
        },
    });
};

/**
 * Hook to bulk upload specialties via CSV
 */
export const useUploadSpecialties = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => apiClient.specialties.upload(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['specialties'] });
        },
    });
};