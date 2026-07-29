import { apiClient } from "@/api/client";

export const fileService = {
  upload: async (file: File): Promise<{ secure_url?: string; data?: { secure_url?: string } }> => {
    return await apiClient.files.upload(file);
  },
};
