import { apiClient } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfessionalDetailsI, StepOneI, StepThreeI, StepTwoI } from "./dentist.interface";


export function objectToFormData<T extends object>(obj: T): FormData {
  const formData = new FormData();

  function parse(val: unknown, pathParts: (string | number)[]) {
    if (val instanceof File) {
      const keys = getKeys(pathParts);
      keys.forEach((k) => formData.append(k, val));
    } else if (val instanceof Date) {
      const keys = getKeys(pathParts);
      keys.forEach((k) => formData.append(k, val.toISOString()));
    } else if (Array.isArray(val)) {
      val.forEach((item, index) => {
        parse(item, [...pathParts, index]);
      });
    } else if (typeof val === "object" && val !== null) {
      Object.entries(val as Record<string, unknown>).forEach(([subKey, subValue]) => {
        parse(subValue, [...pathParts, subKey]);
      });
    } else if (val !== undefined && val !== null) {
      const keys = getKeys(pathParts);
      keys.forEach((k) => formData.append(k, String(val)));
    }
  }

  function getKeys(parts: (string | number)[]): string[] {
    if (parts.length === 0) return [];

    let mixed = String(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (typeof part === "number") {
        mixed += `[${part}]`;
      } else {
        mixed += `.${part}`;
      }
    }

    return [mixed];
  }

  Object.entries(obj).forEach(([key, value]) => {
    parse(value, [key]);
  });

  return formData;
}

function buildStepTwoFormData(data: StepTwoI): FormData {
  const formData = new FormData();

  if (data.jciCertificate) {
    formData.append("jciCertificate", data.jciCertificate);
  }

  if (data.walkthroughVideo) {
    formData.append("walkthroughVideo", data.walkthroughVideo);
  }

  formData.append("signerName", data.signerName);
  formData.append("signature", data.signature);
  formData.append("agreedToGuarantee", String(data.agreedToGuarantee));

  if (data.procedures) {
    formData.append("procedures", JSON.stringify(data.procedures));
  }

  return formData;
}

export function useDentistProgress() {
  return useQuery({
    queryKey: ["dentistVerificationProgress"],
    queryFn: () => apiClient.dentists.getProgress(),
    // enabled: typeof window !== "undefined" && hasSessionCookie(),
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });
}

export function useDentistOverview() {
  return useQuery({
    queryKey: ["dentistOverviewData"],
    queryFn: () => apiClient.dentists.getOverviewData(),
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
}

export function useUpdateVerificationPhase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { verification_phase: string }) =>
      apiClient.dentists.updateVerificationPhase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    },
  });
}

export default function useDentist() {
  const queryClient = useQueryClient();

  const invalidateVerification = () => {
    queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    queryClient.invalidateQueries({ queryKey: ["licenseVerifyProgress"] });
    queryClient.invalidateQueries({ queryKey: ["photoVerifyProgress"] });
    queryClient.invalidateQueries({ queryKey: ["idVerifyProgress"] });
    queryClient.invalidateQueries({ queryKey: ["stepOneCheck"] });
    queryClient.invalidateQueries({ queryKey: ["stepTwoCheck"] });
    queryClient.invalidateQueries({ queryKey: ["stepThreeCheck"] });
    queryClient.invalidateQueries({ queryKey: ["dentist_procedures"] });
  };

  const professionalDetailsMutation = useMutation({
    mutationFn: (data: ProfessionalDetailsI) => apiClient.dentists.professionalDetails(data),
  });

  const stepOneMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepOne"],
    mutationFn: (data: StepOneI & { profilePicture: File; licenseDocument?: File }) =>
      apiClient.dentists.stepOne(objectToFormData(data)),
    onSuccess: invalidateVerification,
  });

  const stepTwoMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepTwo"],
    mutationFn: (data: StepTwoI) =>
      apiClient.dentists.stepTwoWithFiles(buildStepTwoFormData(data)),
    onSuccess: invalidateVerification,
  });

  const stepThreeMutation = useMutation({
    mutationKey: ["dentist", "verification", "stepThree"],
    mutationFn: async (data: StepThreeI) => {
      // 1. Upload files first and collect their secure URLs
      const procedureDocs = await Promise.all(
        data.materials.map(async (m) => {
          let ceCertificateUrl = "";
          let materialBrandsUrl = "";
          let invoiceUrl = "";
          let protocolPdfUrl = "";

          if (m.ce_certificate instanceof File) {
            const res = await apiClient.files.upload(m.ce_certificate);
            ceCertificateUrl = res.data?.secure_url || "";
          } else if (typeof m.ce_certificate === "string") {
            ceCertificateUrl = m.ce_certificate;
          }

          if (m.material_brands instanceof File) {
            const res = await apiClient.files.upload(m.material_brands);
            materialBrandsUrl = res.data?.secure_url || "";
          } else if (typeof m.material_brands === "string") {
            materialBrandsUrl = m.material_brands;
          }

          if (m.invoice instanceof File) {
            const res = await apiClient.files.upload(m.invoice);
            invoiceUrl = res.data?.secure_url || "";
          } else if (typeof m.invoice === "string") {
            invoiceUrl = m.invoice;
          }

          if (m.protocol_pdf instanceof File) {
            const res = await apiClient.files.upload(m.protocol_pdf);
            protocolPdfUrl = res.data?.secure_url || "";
          } else if (typeof m.protocol_pdf === "string") {
            protocolPdfUrl = m.protocol_pdf;
          }

          return {
            dentistProcedureId: String(m.own_procedure),
            ceCertificate: ceCertificateUrl,
            materialBrands: materialBrandsUrl || "",
            invoice: invoiceUrl,
            protocolPdf: protocolPdfUrl,
          };
        })
      );

      // 2. Build final JSON payload matching backend submitClinicDepthSchema
      const payload = {
        clinicAddress: data.clinic_address?.address || "",
        procedureDocs,
      };

      // 3. Post JSON payload
      return apiClient.dentists.stepThree(payload);
    },
    onSuccess: invalidateVerification,
  });

  const stepOneCheckQuery = useQuery({
    queryKey: ["stepOneCheck"],
    queryFn: () => apiClient.dentists.stepOneCheck(),
    enabled: false,
  });

  const stepTwoCheckQuery = useQuery({
    queryKey: ["stepTwoCheck"],
    queryFn: () => apiClient.dentists.stepTwoCheck(),
    enabled: false,
  });

  const globalProcedureListQuery = useQuery({
    queryKey: ["global_procedure_list"],
    queryFn: () => apiClient.dentists.global_procedure_list(),
    // enabled: true,
  });

  const stepThreeCheckQuery = useQuery({
    queryKey: ["stepThreeCheck"],
    queryFn: () => apiClient.dentists.stepThreeCheck(),
    enabled: false,
  });

  const dentistProcedureList = useQuery({
    queryKey: ["dentist_procedures"],
    queryFn: () => apiClient.dentists.dentistProcedureList(),
    // enabled: typeof window !== "undefined" && hasSessionCookie(),
  });

  const dentistProfile = useQuery({
    queryKey: ["dentist_profile"],
    queryFn: () => apiClient.dentists.dentistProfile(),
  })

  return {
    // Mutations
    stepOneMutation,
    stepTwoMutation,
    stepThreeMutation,
    professionalDetailsMutation,

    // Mutation Loading States
    isStepOneLoading: stepOneMutation.isPending,
    isStepTwoLoading: stepTwoMutation.isPending,
    isStepThreeLoading: stepThreeMutation.isPending,
    isProfessionalDetailsLoading: professionalDetailsMutation.isPending,

    // Mutation Error States
    isStepOneError: stepOneMutation.isError,
    isStepTwoError: stepTwoMutation.isError,
    isStepThreeError: stepThreeMutation.isError,
    isProfessionalDetailsError: professionalDetailsMutation.isError,
    stepOneError: stepOneMutation.error,
    stepTwoError: stepTwoMutation.error,
    stepThreeError: stepThreeMutation.error,
    professionalDetailsError: professionalDetailsMutation.error,
    professionalDetailsSuccess: professionalDetailsMutation.isSuccess,

    // global procedure list 
    globalProcedureListQuery,
    checkGlobalProcedureList: globalProcedureListQuery.refetch,
    isGlobalProcedureListLoading: globalProcedureListQuery.isFetching,
    isGlobalProcedureListError: globalProcedureListQuery.isError,
    globalProcedureListError: globalProcedureListQuery.error,
    globalProcedureListData: globalProcedureListQuery.data,

    // profile
    dentistProfile,
    isDentistProfileLoading: dentistProfile.isFetching,
    isDentistProfileError: dentistProfile.isError,
    dentistProfileError: dentistProfile.error,
    dentistProfileData: dentistProfile.data,

    checkStepOne: stepOneCheckQuery.refetch,
    checkStepTwo: stepTwoCheckQuery.refetch,
    checkStepThree: stepThreeCheckQuery.refetch,

    stepOneCheckData: stepOneCheckQuery.data,
    stepTwoCheckData: stepTwoCheckQuery.data,
    stepThreeCheckData: stepThreeCheckQuery.data,

    isStepOneCheckLoading: stepOneCheckQuery.isFetching,
    isStepTwoCheckLoading: stepTwoCheckQuery.isFetching,
    isStepThreeCheckLoading: stepThreeCheckQuery.isFetching,

    // Check Error States
    isStepOneCheckError: stepOneCheckQuery.isError,
    isStepTwoCheckError: stepTwoCheckQuery.isError,
    isStepThreeCheckError: stepThreeCheckQuery.isError,
    stepOneCheckError: stepOneCheckQuery.error,
    stepTwoCheckError: stepTwoCheckQuery.error,
    stepThreeCheckError: stepThreeCheckQuery.error,

    dentistProcedureList,
    dentistProcedureListData: dentistProcedureList.data,
    dentistProcedureListLoading: dentistProcedureList.isFetching,
    dentistProcedureListError: dentistProcedureList.error,
    dentistProcedureListRefetch: dentistProcedureList.refetch,
  };
}
