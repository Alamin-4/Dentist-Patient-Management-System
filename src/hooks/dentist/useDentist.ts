import { dentistApi } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfessionalDetailsI, StepOneI, StepThreeI, StepTwoI } from "./dentist.interface";

export function objectToFormData(obj: any): FormData {
  const formData = new FormData();
  
  function append(key: string, value: any) {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        append(`${key}[${index}]`, item);
      });
    } else if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((subKey) => {
        append(`${key}.${subKey}`, value[subKey]);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  Object.keys(obj).forEach((key) => {
    append(key, obj[key]);
  });

  return formData;
}

export function useDentistProgress() {
  return useQuery({
    queryKey: ["dentistVerificationProgress"],
    queryFn: () => dentistApi.getVerificationProgress(),
    retry: false,
  });
}

export function useUpdateVerificationPhase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { verification_phase: string }) =>
      dentistApi.updateVerificationPhase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    },
  });
}

export default function useDentist() {
  const queryClient = useQueryClient();

  const professionalDetailsMutation = useMutation({
    mutationFn: (data: ProfessionalDetailsI) => {
      return dentistApi.professionalDetails(data);
    },
  });
  const stepOneMutation = useMutation({
    mutationFn: (data: StepOneI) => {
      const formData = objectToFormData(data);
      return dentistApi.stepOne(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    },
  });

  const stepTwoMutation = useMutation({
    mutationFn: (data: StepTwoI) => {
      const formData = objectToFormData(data);
      return dentistApi.stepTwo(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    },
  });

  const stepThreeMutation = useMutation({
    mutationFn: (data: StepThreeI) => {
      const formData = objectToFormData(data);
      return dentistApi.stepThree(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dentistVerificationProgress"] });
    },
  });

  const stepOneCheckMutation = useMutation({
    mutationFn: () => dentistApi.stepOneCheck() 
  });

  const stepTwoCheckMutation = useMutation({
    mutationFn: () => dentistApi.stepTwoCheck() 
  });

  const stepThreeCheckMutation = useMutation({
    mutationFn: () => dentistApi.stepThreeCheck() 
  });

  return {
    stepOneMutation,
    stepTwoMutation,
    stepThreeMutation,
    isStepOneLoading: stepOneMutation.isPending,
    isStepTwoLoading: stepTwoMutation.isPending,
    isStepThreeLoading: stepThreeMutation.isPending,
    isStepOneError: stepOneMutation.isError,
    isStepTwoError: stepTwoMutation.isError,
    isStepThreeError: stepThreeMutation.isError,
    stepOneError: stepOneMutation.error,
    stepTwoError: stepTwoMutation.error,
    stepThreeError: stepThreeMutation.error,
    stepOneCheckMutation,
    stepTwoCheckMutation,
    stepThreeCheckMutation,
    isStepOneCheckLoading: stepOneCheckMutation.isPending,
    isStepTwoCheckLoading: stepTwoCheckMutation.isPending,
    isStepThreeCheckLoading: stepThreeCheckMutation.isPending,
    isStepOneCheckError: stepOneCheckMutation.isError,
    isStepTwoCheckError: stepTwoCheckMutation.isError,
    isStepThreeCheckError: stepThreeCheckMutation.isError,
    stepOneCheckError: stepOneCheckMutation.error,
    stepTwoCheckError: stepTwoCheckMutation.error,
    stepThreeCheckError: stepThreeCheckMutation.error,
    professionalDetailsMutation,
    isProfessionalDetailsLoading: professionalDetailsMutation.isPending,
    isProfessionalDetailsError: professionalDetailsMutation.isError,
    professionalDetailsError: professionalDetailsMutation.error,
    professionalDetailsSuccess: professionalDetailsMutation.isSuccess,
  };
}