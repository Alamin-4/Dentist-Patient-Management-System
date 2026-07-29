import { useState, useMemo } from "react";
import { usePatientTreatmentPlans } from "@/hooks/treatment-plan/useTreatmentPlan";
import { useUploadPatientResult } from "./usePatientResultActions";
import { normalizeApiError } from "@/api/error-handler";

export interface AddPhotoControllerProps {
  onClose: () => void;
}

export function useAddPhotoController({ onClose }: AddPhotoControllerProps) {
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [selectedDentistId, setSelectedDentistId] = useState("");
  const [treatment, setTreatment] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { data: treatmentPlansResponse } = usePatientTreatmentPlans();
  const treatmentPlans = treatmentPlansResponse?.data || [];

  const uploadMutation = useUploadPatientResult();

  const uniqueDentists = useMemo(() => {
    const map = new Map();
    treatmentPlans.forEach((plan: any) => {
      const dentist = plan.dentist;
      if (plan.status === "ACTIVE" || plan.status === "COMPLETED") {
        if (dentist) {
          const id = dentist.id;
          const name = dentist.user
            ? `Dr. ${dentist.user.firstName} ${dentist.user.lastName}`.trim()
            : dentist.dentistDirectory?.name || "Dentist";

          const city = dentist.dentistDirectory?.city || "";
          const country = dentist.dentistDirectory?.country || dentist.user?.country || "";
          const location = city && country ? `${city}, ${country}` : city || country || "N/A";
          map.set(id, { id, name, location });
        }
      }
    });
    return Array.from(map.values()) as Array<{ id: string; name: string; location: string }>;
  }, [treatmentPlans]);

  const uniqueProcedures = useMemo(() => {
    if (!selectedDentistId) return [];
    const proceduresSet = new Set<string>();
    treatmentPlans
      .filter((plan: any) => plan.dentistId === selectedDentistId)
      .forEach((plan: any) => {
        plan.lineItems?.forEach((item: any) => {
          if (item.globalProcedure?.name) {
            proceduresSet.add(item.globalProcedure.name);
          }
        });
      });
    return Array.from(proceduresSet);
  }, [selectedDentistId, treatmentPlans]);

  const handleFileChange = (file: File, type: "before" | "after") => {
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        [type]: `Image is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum allowed size is 5 MB.`,
      }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        [type]: "Only image files (JPG, PNG, WEBP) are allowed.",
      }));
      return;
    }

    if (type === "before") {
      setBeforeFile(file);
      setBeforePreview(URL.createObjectURL(file));
      setFieldErrors((prev) => ({ ...prev, before: "" }));
    } else {
      setAfterFile(file);
      setAfterPreview(URL.createObjectURL(file));
      setFieldErrors((prev) => ({ ...prev, after: "" }));
    }
  };

  const handleClose = () => {
    setBeforeFile(null);
    setBeforePreview(null);
    setAfterFile(null);
    setAfterPreview(null);
    setSelectedDentistId("");
    setTreatment("");
    setFieldErrors({});
    setGeneralError(null);
    onClose();
  };

  const handleAddPhoto = async () => {
    setFieldErrors({});
    setGeneralError(null);

    const errors: Record<string, string> = {};
    if (!beforeFile) errors.before = "Before photo is required.";
    if (!afterFile) errors.after = "After photo is required.";
    if (!selectedDentistId) errors.dentist = "Dentist selection is required.";
    if (!treatment) errors.treatment = "Treatment selection is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const dentistObj = uniqueDentists.find((d) => d.id === selectedDentistId);
    const doctorName = dentistObj ? dentistObj.name : "Dentist";
    const doctorLocation = dentistObj ? dentistObj.location : "N/A";

    uploadMutation.mutate(
      {
        beforeFile: beforeFile!,
        afterFile: afterFile!,
        treatment,
        doctorName,
        doctorLocation,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err: any) => {
          console.error("Upload error:", err);
          const apiErr = normalizeApiError(err);
          if (apiErr.errors && Array.isArray(apiErr.errors)) {
            const errorsMap: Record<string, string> = {};
            (apiErr.errors as any[]).forEach((e: any) => {
              errorsMap[e.field] = e.message;
            });
            setFieldErrors(errorsMap);
          } else {
            setGeneralError(apiErr.message);
          }
        },
      }
    );
  };

  return {
    beforePreview,
    afterPreview,
    selectedDentistId,
    treatment,
    fieldErrors,
    generalError,
    uniqueDentists,
    uniqueProcedures,
    isUploading: uploadMutation.isPending,
    setSelectedDentistId,
    setTreatment,
    setBeforeFile,
    setBeforePreview,
    setAfterFile,
    setAfterPreview,
    handleFileChange,
    handleClose,
    handleAddPhoto,
  };
}
