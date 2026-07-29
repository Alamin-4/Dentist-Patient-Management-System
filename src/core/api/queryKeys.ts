export interface DentistListParams {
  ids?: string[];
  limit?: number;
  status?: string;
  search?: string;
  page?: number;
}

export const queryKeys = {
  dentists: {
    all: ["dentists"] as const,
    list: (params: DentistListParams) => [...queryKeys.dentists.all, "list", params] as const,
    comparison: (ids: string[]) => [...queryKeys.dentists.all, "compare", ids] as const,
  },
  results: {
    all: ["results"] as const,
    list: () => [...queryKeys.results.all, "list"] as const,
    patientList: () => [...queryKeys.results.all, "patientList"] as const,
  },
} as const;
