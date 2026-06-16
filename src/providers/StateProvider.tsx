"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { initializeDentistData } from "@/lib/storage/dentistData";
import { initializeBookingData } from "@/lib/storage/bookingService";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

// Re-export store hooks for direct access
export { useVerificationStore } from "@/lib/hooks/verification-store-hooks";
export { useDataStoreForVerification } from "@/lib/hooks/verification-store-hooks";
export { useUiStoreForVerification } from "@/lib/hooks/verification-store-hooks";

export type kolSteps =
  | "Basic Info"
  | "Bio & Languages"
  | "Contact"
  | "Media & Notes";

export type dentistBookingTabs = "In Progress" | "Completed" | "Rejected";

interface StateContextType {
  verificationStatus: "idle" | "match" | "no-match";
  setVerificationStatus: (status: "idle" | "match" | "no-match") => void;
  verificationStep: number;
  setVerificationStep: (stepOrFn: number | ((prev: number) => number)) => void;
  verificationStepReady: Record<number, boolean>;
  setVerificationStepReady: (step: number, ready: boolean) => void;
  verificationCompletedStep: number | null;
  setVerificationCompletedStep: (step: number | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  showSignupModal: boolean;
  setShowSignupModal: (show: boolean) => void;
  showPersonalizeModal: boolean;
  setShowPersonalizeModal: (show: boolean) => void;
  showCompareModal: boolean;
  setShowCompareModal: (show: boolean) => void;
  compareModalPurpose: "compare" | "postBooking" | null;
  setCompareModalPurpose: (purpose: "compare" | "postBooking" | null) => void;
  showBookingModal: string | null;
  setShowBookingModal: (dentistId: string | null) => void;
  selectedDentistId: string | null;
  setSelectedDentistId: (id: string | null) => void;
  setSchedule: (schedule: boolean) => void;
  schedule: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dentistsToCompare: Dentist[];
  setDentistsToCompare: (dentists: Dentist[] | ((prev: Dentist[]) => Dentist[])) => void;
  kolModalOpen: boolean;
  setKolModalOpen: (open: boolean) => void;
  addKolStep: kolSteps;
  setAddKolStep: (step: kolSteps) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isNewestFirst: boolean;
  setIsNewestFirst: (isNewest: boolean | ((prev: boolean) => boolean)) => void;
  showSigninModal: boolean;
  setShowSigninModal: (show: boolean) => void;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined,
);

// Helper sub-component to handle URL step synchronization inside a Suspense boundary
function StepSync() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlStep = Number(searchParams.get("step"));

  const verificationStep = useAppStore((state) => state.verificationStep);
  const setVerificationStep = useAppStore((state) => state.setVerificationStep);
  const hasInitializedStep = useRef(false);

  // Initialize the step once from the URL or persisted value.
  useEffect(() => {
    if (hasInitializedStep.current) return;
    hasInitializedStep.current = true;

    if (urlStep >= 1 && urlStep <= 3) {
      if (urlStep !== verificationStep) {
        setVerificationStep(urlStep);
      }
    } else {
      const savedStep = typeof window !== "undefined" ? localStorage.getItem("dentist_verification_step") : null;
      if (savedStep) {
        const parsedStep = Number(savedStep);
        if (parsedStep >= 1 && parsedStep <= 3) {
          setVerificationStep(parsedStep);
          router.replace(`?step=${parsedStep}`);
          return;
        }
      }
      router.replace("?step=1");
    }
  }, [urlStep, verificationStep, router, setVerificationStep]);

  // After initialization, let the store drive the URL.
  useEffect(() => {
    if (!hasInitializedStep.current) return;
    if (urlStep !== verificationStep) {
      router.push(`?step=${verificationStep}`);
    }
  }, [verificationStep, urlStep, router]);

  return null;
}

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const store = useAppStore();

  useEffect(() => {
    initializeDentistData();
    initializeBookingData();

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope,
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  const value: StateContextType = {
    verificationStatus: store.verificationStatus,
    setVerificationStatus: store.setVerificationStatus,
    verificationStep: store.verificationStep,
    setVerificationStep: store.setVerificationStep,
    verificationStepReady: store.verificationStepReady,
    setVerificationStepReady: store.setVerificationStepReady,
    verificationCompletedStep: store.verificationCompletedStep,
    setVerificationCompletedStep: store.setVerificationCompletedStep,
    nextStep: store.nextStep,
    prevStep: store.prevStep,

    // Modals mapping
    showSignupModal: store.activeModal === "signup",
    setShowSignupModal: (show) => store.openModal(show ? "signup" : null),
    showSigninModal: store.activeModal === "signin",
    setShowSigninModal: (show) => store.openModal(show ? "signin" : null),
    showPersonalizeModal: store.activeModal === "personalize",
    setShowPersonalizeModal: (show) => store.openModal(show ? "personalize" : null),
    showCompareModal: store.activeModal === "compare",
    setShowCompareModal: (show) => store.openModal(show ? "compare" : null),
    
    // Booking modal uses selectedDentistId and activeModal
    showBookingModal: store.activeModal === "booking" ? store.selectedDentistId : null,
    setShowBookingModal: (dentistId) => {
      if (dentistId) {
        store.setSelectedDentistId(dentistId);
        store.openModal("booking");
      } else {
        store.openModal(null);
      }
    },

    compareModalPurpose: store.compareModalPurpose,
    setCompareModalPurpose: store.setCompareModalPurpose,
    selectedDentistId: store.selectedDentistId,
    setSelectedDentistId: store.setSelectedDentistId,
    schedule: store.schedule,
    setSchedule: store.setSchedule,
    activeTab: store.activeTab,
    setActiveTab: store.setActiveTab,
    dentistsToCompare: store.dentistsToCompare,
    setDentistsToCompare: store.setDentistsToCompare,
    kolModalOpen: store.kolModalOpen,
    setKolModalOpen: store.setKolModalOpen,
    addKolStep: store.addKolStep,
    setAddKolStep: store.setAddKolStep,
    searchQuery: store.searchQuery,
    setSearchQuery: store.setSearchQuery,
    isNewestFirst: store.isNewestFirst,
    setIsNewestFirst: store.setIsNewestFirst,
  };

  return (
    <StateContext.Provider value={value}>
      <Suspense fallback={null}>
        <StepSync />
      </Suspense>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
