import { apiClient } from "@/api/client";

export interface CreateDentistResultPayload {
  title: string;
  patientName: string;
  date: string;
  location: string;
  beforeImage: string;
  afterImage: string;
}

export interface UploadPatientResultPayload {
  title: string;
  doctor: string;
  location: string;
  beforeImg: string;
  afterImg: string;
}

export const resultService = {
  getDentistResults: async () => {
    return await apiClient.dentists.getResults();
  },
  createDentistResult: async (payload: CreateDentistResultPayload) => {
    return await apiClient.dentists.createResult(payload);
  },
  uploadPatientResult: async (payload: UploadPatientResultPayload) => {
    return await apiClient.patients.uploadResult(payload);
  },
};
