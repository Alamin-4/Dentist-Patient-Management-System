"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { useRouter } from "next/navigation";
import {
  getBookingData,
  getBookingDraft,
  getFrontSmileFile,
  getXrayFile,
  markBookingStepComplete,
  setBookingCurrentStep,
  setConsultationId,
  updateBookingData,
  getAllDentalPhotos,
  getDentalPhotosList,
  clearBookingData,
} from "@/lib/storage/bookingService";
import toast from "react-hot-toast";
import PersonalInfoForm from "./BookingIntakeForm/PersonalInfoForm";
import ProcedureSelectionForm from "./BookingIntakeForm/ProcedureSelectionForm";
import TreatmentDetailsForm, { treatmentDetailsSchema } from "./BookingIntakeForm/TreatmentDetailsForm";
import DentalHistoryForm from "./BookingIntakeForm/DentalHistoryForm";
import PhotoUploadForm, { photoUploadSchema } from "./BookingIntakeForm/PhotoUploadForm";
import XRayUploadForm, { xrayUploadSchema } from "./BookingIntakeForm/XRayUploadForm";
import RequestSuccessModal from "./BookingIntakeForm/RequestSuccessModal";
import { Loader2 } from "lucide-react";
import { consultationBookingApi } from "@/api/client";

const TOTAL_STEPS = 6;

export default function IntakeModal() {
  const router = useRouter();
  const [step, setStep] = useState(() => {
    const s = getBookingDraft().currentStep;
    return typeof s === "number" && s >= 1 && s <= TOTAL_STEPS ? s : 1;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const {
    showBookingModal,
    setShowBookingModal,
    setShowCompareModal,
    setCompareModalPurpose,
    setSchedule,
    dentistsToCompare,
    selectedDentistId,
    compareModalPurpose,
    bookingMode,
  } = useStateContext();

  useEffect(() => {
    if (showBookingModal === "book") {
      const draft = getBookingDraft();
      if (draft.consultationId && draft.completedSteps.includes(TOTAL_STEPS)) {
        setShowBookingModal(null);
        if (bookingMode === "request") {
          setShowSuccessModal(true);
          return;
        }

        const params = new URLSearchParams();
        if (selectedDentistId) {
          params.set("dentistIds", selectedDentistId);
        } else if (dentistsToCompare && dentistsToCompare.length > 0) {
          params.set("dentistIds", dentistsToCompare.map((d) => d.id).join(","));
        }
        params.set("consultationId", String(draft.consultationId));
        router.push(`/schedule?${params.toString()}`);
        return;
      }

      const s = draft.currentStep;
      const validStep = typeof s === "number" && s >= 1 && s <= TOTAL_STEPS ? s : 1;
      setStep(validStep);
    }
  }, [showBookingModal, bookingMode, selectedDentistId, dentistsToCompare, router, setShowBookingModal]);

  const progress = (step / TOTAL_STEPS) * 100;

  const syncStep = (nextStep: number) => {
    setStep(nextStep);
    setBookingCurrentStep(nextStep);
    setFormErrors({});
  };

  const validateStep = (): boolean => {
    const data = getBookingData();

    switch (step) {
      case 1: {
        const { firstName, lastName, dateOfBirth, country } =
          data.personalInfo;
        const newErrors: Record<string, string> = {};
        if (!firstName) newErrors.firstName = "First name is required";
        if (!lastName) newErrors.lastName = "Last name is required";
        if (!dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
        if (!country) newErrors.country = "Country is required";

        if (Object.keys(newErrors).length > 0) {
          setFormErrors(newErrors);
          return false;
        }
        return true;
      }
      case 2:
        if (data.procedureIds.length === 0) {
          setFormErrors({ procedures: "Select your preferable procedure" });
          return false;
        }
        return true;
      case 3: {
        const result = treatmentDetailsSchema.safeParse(data);
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (path !== undefined) {
              newErrors[String(path)] = issue.message;
            }
          });
          setFormErrors(newErrors);
          return false;
        }
        return true;
      }
      case 4:
        if (!data.dentalHistory.lastVisit) {
          const newErrors: Record<string, string> = {};
          newErrors.lastVisit = "Please select when you last visited a dentist";
          setFormErrors(newErrors);
          return false;
        }
        return true;
      case 5: {
        const result = photoUploadSchema.safeParse(getAllDentalPhotos());
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (path !== undefined) {
              newErrors[String(path)] = issue.message;
            }
          });
          setFormErrors(newErrors);
          return false;
        }
        return true;
      }
      case 6: {
        const xrayFile = getXrayFile();
        const result = xrayUploadSchema.safeParse({
          file: xrayFile,
          notes: data.xrayNotes,
        });
        if (!result.success) {
          const newErrors: Record<string, string> = {};
          result.error.issues.forEach((issue) => {
            const path = issue.path[0];
            if (path !== undefined) {
              newErrors[String(path)] = issue.message;
            }
          });
          setFormErrors(newErrors);
          return false;
        }
        return true;
      }
      default:
        return true;
    }
  };

  const getRequiredConsultationId = () => {
    const consultationId = getBookingDraft().consultationId;
    if (!consultationId) {
      throw new Error("Please complete the previous booking step first.");
    }
    return consultationId;
  };

  const getResultConsultationId = (response: unknown) => {
    const payload = response as {
      data?: {
        id?: string | number;
        consultation_id?: string | number;
        data?: {
          id?: string | number;
          consultation_id?: string | number;
        };
      };
      id?: string | number;
      consultation_id?: string | number;
    };

    return (
      payload.data?.consultation_id ??
      payload.data?.id ??
      payload.data?.data?.consultation_id ??
      payload.data?.data?.id ??
      payload.consultation_id ??
      payload.id ??
      null
    );
  };

  const submitCurrentStep = async () => {
    const data = getBookingData();

    if (step === 1) {
      const response = await consultationBookingApi.stepOne({
        first_name: data.personalInfo.firstName,
        last_name: data.personalInfo.lastName,
        country: data.personalInfo.country,
        date_of_birth: data.personalInfo.dateOfBirth,
      });
      const consultationId = getResultConsultationId(response);
      if (consultationId) setConsultationId(consultationId);
      return;
    }

    if (step === 2) {
      await consultationBookingApi.stepTwo({
        procedures: data.procedureIds,
      });
      return;
    }

    if (step === 3) {
      await consultationBookingApi.stepThree({
        consultation_id: getRequiredConsultationId(),
        approximate_budget: Number(String(data.budget).replace(/[^0-9.]/g, "")),
        travel_start_date: data.travelFrom,
        travel_end_date: data.travelTo,
      });
      return;
    }

    if (step === 4) {
      await consultationBookingApi.stepFour({
        consultation_id: getRequiredConsultationId(),
        last_dentist_visit: data.dentalHistory.lastVisit,
        conditions: data.dentalHistory.conditions.filter(
          (condition) => condition !== "None of them",
        ),
        notes: data.dentalHistory.additionalInfo,
      });
      return;
    }

    if (step === 5) {
      const photos = getDentalPhotosList();
      await consultationBookingApi.stepFive({
        consultation_id: getRequiredConsultationId(),
        photos,
      });
      return;
    }

    if (step === 6) {
      const file = getXrayFile();
      if (file) {
        await consultationBookingApi.stepSix({
          consultation_id: getRequiredConsultationId(),
          file,
          notes: data.xrayNotes,
        });
      }
    }
  };

  const handleNext = async () => {
    const draft = getBookingDraft();
    if (step === TOTAL_STEPS && draft.completedSteps.includes(TOTAL_STEPS)) {
      setShowBookingModal(null);
      if (bookingMode === "request") {
        setShowSuccessModal(true);
        return;
      }
      const params = new URLSearchParams();
      if (selectedDentistId) {
        params.set("dentistIds", selectedDentistId);
      } else if (dentistsToCompare && dentistsToCompare.length > 0) {
        params.set("dentistIds", dentistsToCompare.map((d) => d.id).join(","));
      }
      if (draft.consultationId) {
        params.set("consultationId", String(draft.consultationId));
      }
      router.push(`/schedule?${params.toString()}`);
      return;
    }

    if (!validateStep()) return;

    if (step > 1 && !draft.consultationId) {
      toast.error("Please complete the first step before continuing.");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitCurrentStep();
      markBookingStepComplete(step);

      if (step < TOTAL_STEPS) {
        syncStep(step + 1);
        return;
      }

      updateBookingData({ currentStep: TOTAL_STEPS });

      if (bookingMode === "request") {
        const draft = getBookingDraft();
        const intakeId = draft.consultationId;
        const dentistIds = draft.selectedBackendDentistIds.length > 0
          ? draft.selectedBackendDentistIds
          : draft.selectedDentistIds;

        if (!intakeId || dentistIds.length === 0) {
          toast.error("Intake ID or Dentist selection is missing.");
          return;
        }

        await consultationBookingApi.confirmRequest({
          consultation_id: intakeId,
          dentistIds,
        });

        toast.success("Your consultation request was submitted.");
        setShowBookingModal(null);
        setShowSuccessModal(true);
        return;
      }

      toast.success("Your consultation details are saved.");
      setShowBookingModal(null);

      // Multi-dentist compare flow: show postBooking compare modal so the user
      // can pick their preferred dentist. selectedDentistId is set to the first
      // selected dentist by CompareModal, but we need the user to choose again.
      if (dentistsToCompare && dentistsToCompare.length > 1) {
        setCompareModalPurpose("postBooking");
        setSchedule(true);
        setShowCompareModal(true);
      } else if (selectedDentistId) {
        // Single-dentist booking: go straight to schedule
        const draft = getBookingDraft();
        const params = new URLSearchParams();
        params.set("dentistIds", selectedDentistId);
        if (draft.consultationId) {
          params.set("consultationId", String(draft.consultationId));
        }
        router.push(`/schedule?${params.toString()}`);
      } else {
        // Fallback: open postBooking compare to let user pick a dentist
        setCompareModalPurpose("postBooking");
        setSchedule(true);
        setShowCompareModal(true);
      }
    } catch (error: any) {
      console.error("Error submitting intake step:", error);
      if (error?.errors && Array.isArray(error.errors)) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const fieldName = err.field?.replace("body.", "") || "";
          if (fieldName) {
            newErrors[fieldName] = err.message || "Invalid input";
          }
        });
        setFormErrors(newErrors);
      } else if (
        error?.errorDetails?.code === "LIMIT_FILE_SIZE" ||
        error?.errorDetails?.name === "MulterError" ||
        error?.message?.includes("too large")
      ) {
        const newErrors: Record<string, string> = {
          file: error.message || "File too large (Max 5MB)",
        };
        setFormErrors(newErrors);
      } else {
        toast.error(error?.message || "Failed to submit consultation details. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) syncStep(step - 1);
  };

  const handleClose = () => {
    if (showBookingModal === "book") {
      setShowBookingModal(null);
      // Reset step state so stale step doesn't linger if the user re-opens
      setStep(1);
      setFormErrors({});
    }
  };

  const handleGoToBookings = () => {
    setShowSuccessModal(false);
    router.push("/patient");
  };

  return (
    <>
      <Dialog open={showBookingModal === "book"} onOpenChange={handleClose}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-212 max-h-[90vh] flex flex-col w-full p-0 border-none rounded-lg bg-white overflow-hidden"
        >
          <div className="relative bg-white pl-8 pr-16 py-6 border-b border-[#F3F4F6] shrink-0">
            <DialogTitle className="text-[20px] font-bold text-text">
              {bookingMode === "request" ? "Request Consultation" : "Book Consultation"}
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto p-8 min-h-0">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#113254] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sec-text font-medium text-[14px] whitespace-nowrap">
                Step {step} of {TOTAL_STEPS}
              </span>
            </div>

            <div>
              {step === 1 && <PersonalInfoForm errors={formErrors} setErrors={setFormErrors} />}
              {step === 2 && <ProcedureSelectionForm errors={formErrors} setErrors={setFormErrors} />}
              {step === 3 && <TreatmentDetailsForm errors={formErrors} setErrors={setFormErrors} />}
              {step === 4 && <DentalHistoryForm errors={formErrors} setErrors={setFormErrors} />}
              {step === 5 && <PhotoUploadForm errors={formErrors} setErrors={setFormErrors} />}
              {step === 6 && <XRayUploadForm errors={formErrors} setErrors={setFormErrors} />}
            </div>

            <div className="flex justify-between mt-10 pt-6 border-t border-[#F3F4F6]">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 lg:px-8 py-2 lg:py-3.5 bg-white border border-[#E5E7EB] text-text rounded-lg hover:bg-[#F9FAFB] active:scale-95 transition-all cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || Object.values(formErrors).some(Boolean)}
                className="inline-flex items-center justify-center gap-2 px-6 lg:px-12 py-2 lg:py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white rounded-lg active:scale-95 transition-all disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 disabled:border-slate-200 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting && <Loader2 className="size-5 animate-spin" />}
                {step === TOTAL_STEPS
                  ? bookingMode === "request"
                    ? "Submit Consultation Request"
                    : "Submit and Get Estimates"
                  : "Continue"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RequestSuccessModal open={showSuccessModal} onClose={handleGoToBookings} />
    </>
  );
}
