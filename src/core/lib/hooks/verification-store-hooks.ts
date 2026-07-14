"use client";

import { useAppStore } from "@/store/useAppStore";

// Verification-related states hook
export const useVerificationStore = () => {
  const verificationStatus = useAppStore((state) => state.verificationStatus);
  const setVerificationStatus = useAppStore((state) => state.setVerificationStatus);
  const verificationStep = useAppStore((state) => state.verificationStep);
  const setVerificationStep = useAppStore((state) => state.setVerificationStep);
  const verificationCompletedStep = useAppStore((state) => state.verificationCompletedStep);
  const setVerificationCompletedStep = useAppStore((state) => state.setVerificationCompletedStep);
  const verificationStepReady = useAppStore((state) => state.verificationStepReady);
  const setVerificationStepReady = useAppStore((state) => state.setVerificationStepReady);
  const nextStep = useAppStore((state) => state.nextStep);
  const prevStep = useAppStore((state) => state.prevStep);

  return {
    verificationStatus,
    setVerificationStatus,
    verificationStep,
    setVerificationStep,
    verificationCompletedStep,
    setVerificationCompletedStep,
    verificationStepReady,
    setVerificationStepReady,
    nextStep,
    prevStep,
  };
};

// Data-related states hook for verification UI and data
export const useDataStoreForVerification = () => {
  const selectedDentistId = useAppStore((state) => state.selectedDentistId);
  const setSelectedDentistId = useAppStore((state) => state.setSelectedDentistId);
  const schedule = useAppStore((state) => state.schedule);
  const setSchedule = useAppStore((state) => state.setSchedule);
  const activeTab = useAppStore((state) => state.activeTab);
  const setActiveTab = useAppStore((state) => state.setActiveTab);
  const dentistsToCompare = useAppStore((state) => state.dentistsToCompare);
  const setDentistsToCompare = useAppStore((state) => state.setDentistsToCompare);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const isNewestFirst = useAppStore((state) => state.isNewestFirst);
  const setIsNewestFirst = useAppStore((state) => state.setIsNewestFirst);

  return {
    selectedDentistId,
    setSelectedDentistId,
    schedule,
    setSchedule,
    activeTab,
    setActiveTab,
    dentistsToCompare,
    setDentistsToCompare,
    searchQuery,
    setSearchQuery,
    isNewestFirst,
    setIsNewestFirst,
  };
};

// UI-related states hook for verification modals
export const useUiStoreForVerification = () => {
  const activeModal = useAppStore((state) => state.activeModal);
  const compareModalPurpose = useAppStore((state) => state.compareModalPurpose);
  const setCompareModalPurpose = useAppStore((state) => state.setCompareModalPurpose);
  const kolModalOpen = useAppStore((state) => state.kolModalOpen);
  const setKolModalOpen = useAppStore((state) => state.setKolModalOpen);

  const showSignupModal = activeModal === "signup";
  const showSigninModal = activeModal === "signin";
  const showPersonalizeModal = activeModal === "personalize";
  const showCompareModal = activeModal === "compare";
  const showBookingModal = activeModal === "booking" ? activeModal : null;

  return {
    // Direct store values
    activeModal,
    compareModalPurpose,
    setCompareModalPurpose,
    kolModalOpen,
    setKolModalOpen,

    // Computed values for compatibility
    showSignupModal,
    showSigninModal,
    showPersonalizeModal,
    showCompareModal,
    showBookingModal,
    setActiveModal: (modalType: "signin" | "signup" | "personalize" | "compare" | "booking" | null) => {
      useAppStore.setState({ activeModal: modalType });
    },
  };
};