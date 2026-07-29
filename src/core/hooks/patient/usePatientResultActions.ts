import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fileService } from "@/services/fileService";
import { resultService } from "@/services/resultService";
import { queryKeys } from "@/api/queryKeys";

export interface UploadPatientResultMutationPayload {
  beforeFile: File;
  afterFile: File;
  treatment: string;
  doctorName: string;
  doctorLocation: string;
}

export function useUploadPatientResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UploadPatientResultMutationPayload) => {
      const beforeUploadRes = await fileService.upload(payload.beforeFile);
      const beforeImgUrl = beforeUploadRes.secure_url || beforeUploadRes.data?.secure_url;
      if (!beforeImgUrl) {
        throw new Error("Failed to upload before image");
      }

      const afterUploadRes = await fileService.upload(payload.afterFile);
      const afterImgUrl = afterUploadRes.secure_url || afterUploadRes.data?.secure_url;
      if (!afterImgUrl) {
        throw new Error("Failed to upload after image");
      }

      return await resultService.uploadPatientResult({
        title: payload.treatment,
        doctor: payload.doctorName,
        location: payload.doctorLocation,
        beforeImg: beforeImgUrl,
        afterImg: afterImgUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.results.patientList() });
      queryClient.invalidateQueries({ queryKey: ["patient-results"] });
    },
  });
}
