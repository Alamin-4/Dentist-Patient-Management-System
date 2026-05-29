"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStateContext } from "@/providers/StateProvider";
import { submitBooking, getBookingData } from "@/lib/storage/bookingService";
import toast from "react-hot-toast";
import PersonalInfoForm from "./BookingIntakeForm/PersonalInfoForm";
import ProcedureSelectionForm from "./BookingIntakeForm/ProcedureSelectionForm";
import TreatmentDetailsForm from "./BookingIntakeForm/TreatmentDetailsForm";
import DentalHistoryForm from "./BookingIntakeForm/DentalHistoryForm";
import PhotoUploadForm from "./BookingIntakeForm/PhotoUploadForm";
import XRayUploadForm from "./BookingIntakeForm/XRayUploadForm";

const TOTAL_STEPS = 6;

export default function IntakeModal() {
  const [step, setStep] = useState(1);
  const {
    showBookingModal,
    setShowBookingModal,
    setShowCompareModal,
    setCompareModalPurpose,
    selectedDentistId,
    setSchedule,
  } = useStateContext();

  const progress = (step / TOTAL_STEPS) * 100;

  const validateStep = (): boolean => {
    const data = getBookingData();

    switch (step) {
      case 1: {
        const { firstName, lastName, email, dateOfBirth, country } =
          data.personalInfo;
        if (!firstName || !lastName || !email || !dateOfBirth || !country) {
          toast.error("Please fill in all required personal information fields");
          return false;
        }
        return true;
      }
      case 2:
        if (!data.procedure) {
          toast.error("Please select a procedure");
          return false;
        }
        return true;
      case 3:
        if (!data.budget || !data.travelFrom) {
          toast.error("Please fill in your budget and travel dates");
          return false;
        }
        return true;
      case 4:
        if (!data.dentalHistory.lastVisit) {
          toast.error("Please select when you last visited a dentist");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }

    // Step 6 — submit
    if (!selectedDentistId) {
      toast.error("No dentist selected. Please select a dentist first.");
      return;
    }

    try {
      submitBooking(selectedDentistId);
      toast.success("Your booking has been submitted successfully!");
      setShowBookingModal(null);
      setCompareModalPurpose("postBooking");
      setSchedule(true);
      setShowCompareModal(true);
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleClose = () => {
    setShowBookingModal(null);
    setStep(1);
  };

  return (
    <Dialog open={showBookingModal === "book"} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-212 max-h-[90vh] overflow-y-auto w-full p-0 border-none rounded-xl bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[20px] font-bold text-[#1A1A2E]">
            Book Consultation
          </DialogTitle>
        </div>

        <div className="p-8">
          {/* Progress bar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#113254] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[#6B7280] font-medium text-[14px] whitespace-nowrap">
              Step {step} of {TOTAL_STEPS}
            </span>
          </div>

          {/* Step content */}
          <div>
            {step === 1 && <PersonalInfoForm />}
            {step === 2 && <ProcedureSelectionForm />}
            {step === 3 && <TreatmentDetailsForm />}
            {step === 4 && <DentalHistoryForm />}
            {step === 5 && <PhotoUploadForm />}
            {step === 6 && <XRayUploadForm />}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-[#F3F4F6]">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-8 py-3.5 bg-white border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-[16px] rounded-xl hover:bg-[#F9FAFB] active:scale-95 transition-all"
              >
                Back
              </button>
            ) : (
              <div />
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-12 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[16px] rounded-xl active:scale-95 transition-all"
            >
              {step === TOTAL_STEPS ? "Submit and Get Estimates" : "Continue"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
