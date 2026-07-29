import { apiClient } from "@/api/client";

export interface GetDirectoryListParams {
  ids?: string[];
  limit?: number;
}

export const dentistService = {
  getDirectoryList: async (params?: GetDirectoryListParams) => {
    return await apiClient.dentists.getDirectoryList(params);
  },
};
