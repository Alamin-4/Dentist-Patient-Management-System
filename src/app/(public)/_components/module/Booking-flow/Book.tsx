"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PersonalInfoForm from "./BookingIntakeForm/PersonalInfoForm";
import { useStateContext } from "@/providers/StateProvider";
import ProcedureSelectionForm from "./BookingIntakeForm/ProcedureSelectionForm";
import TreatmentDetailsForm from "./BookingIntakeForm/TreatmentDetailsForm";
import DentalHistoryForm from "./BookingIntakeForm/DentalHistoryForm";
import PhotoUploadForm from "./BookingIntakeForm/PhotoUploadForm";
import XRayUploadForm from "./BookingIntakeForm/XRayUploadForm";
import toast from "react-hot-toast";
import { submitBooking, getBookingData } from "@/lib/storage/bookingService";

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
  const totalSteps = 6;
  const progress = (step / totalSteps) * 100;

  const validateStep = (): boolean => {
    const bookingData = getBookingData();

    switch (step) {
      case 1:
        if (
          !bookingData.personalInfo.firstName ||
          !bookingData.personalInfo.lastName ||
          !bookingData.personalInfo.email ||
          !bookingData.personalInfo.dateOfBirth ||
          !bookingData.personalInfo.country
        ) {
          toast.error("Please fill in all personal information fields");
          // open compare modal in post-booking mode so user can proceed to scheduling
          setCompareModalPurpose("postBooking");
          setShowCompareModal(true);
        }
        return true;
      case 2:
        if (!bookingData.procedure) {
          toast.error("Please select a procedure");
          return false;
        }
        return true;
      case 3:
        if (!bookingData.budget || !bookingData.treatmentDate) {
          toast.error("Please fill in budget and treatment date");
          return false;
        }
        return true;
      case 4:
        if (!bookingData.dentalHistory.lastVisit) {
          toast.error("Please select your last dental visit time");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit the booking
      if (selectedDentistId) {
        try {
          submitBooking(selectedDentistId);
          toast.success(
            "Your booking request has been submitted successfully!",
          );
          setShowBookingModal(null);
          setShowCompareModal(true);
          setSchedule(true);
        } catch (error) {
          toast.error("Failed to submit booking. Please try again.");
        }
      } else {
        toast.error("Please select a dentist before booking");
      }
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Dialog
      open={showBookingModal === "book"}
      onOpenChange={() => setShowBookingModal(null)}
    >
      <DialogContent className="sm:max-w-212 max-h-[90vh] overflow-y-auto w-full p-0 border-none rounded-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="lg:text-xl font-semibold text-[#1A1A2E]">
            Book Consulting
          </DialogTitle>
        </div>

        <div className="p-8">
          {/* Progress Bar Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#113254] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[#6B7280] font-medium text-[15px] whitespace-nowrap">
              Step {step} of {totalSteps}
            </span>
          </div>

          {/* Conditional Rendering of Forms */}
          <div>
            {step === 1 && <PersonalInfoForm />}
            {step === 2 && <ProcedureSelectionForm />}
            {step === 3 && <TreatmentDetailsForm />}
            {step === 4 && <DentalHistoryForm />}
            {step === 5 && <PhotoUploadForm />}
            {step === 6 && <XRayUploadForm />}
          </div>

          <div className="flex justify-between mt-10 pt-6 border-t border-[#F3F4F6]">
            {step > 1 && (
              <button
                onClick={handlePreviousStep}
                className="px-8 py-3.5 bg-white border border-[#E5E7EB] text-[#1A1A2E] font-semibold text-[17px] rounded-xl transition-all hover:bg-[#F9FAFB] active:scale-95"
              >
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-12 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[17px] rounded-xl transition-all active:scale-95 ml-auto"
            >
              {step === totalSteps ? "Submit Booking" : "Continue"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
