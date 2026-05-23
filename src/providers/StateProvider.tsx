"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { initializeDentistData } from "@/lib/storage/dentistData";
import { initializeBookingData } from "@/lib/storage/bookingService";
import type { Dentist } from "@/app/(marketing)/_components/module/DentistAllComponents/types";

interface StateContextType {
  verificationStatus: "idle" | "match" | "no-match";
  setVerificationStatus: React.Dispatch<
    React.SetStateAction<"idle" | "match" | "no-match">
  >;
  verificationStep: number;
  setVerificationStep: React.Dispatch<React.SetStateAction<number>>;
  showSignupModal: boolean;
  setShowSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
  showPersonalizeModal: boolean;
  setShowPersonalizeModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCompareModal: boolean;
  setShowCompareModal: React.Dispatch<React.SetStateAction<boolean>>;
  compareModalPurpose: "compare" | "postBooking" | null;
  setCompareModalPurpose: React.Dispatch<
    React.SetStateAction<"compare" | "postBooking" | null>
  >;
  showBookingModal: string | null;
  setShowBookingModal: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDentistId: string | null;
  setSelectedDentistId: React.Dispatch<React.SetStateAction<string | null>>;
  setSchedule: React.Dispatch<React.SetStateAction<boolean>>;
  schedule: boolean;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  dentistsToCompare: Dentist[];
  setDentistsToCompare: React.Dispatch<React.SetStateAction<Dentist[]>>;
}

export const StateContext = createContext<StateContextType | undefined>(
  undefined,
);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "match" | "no-match"
  >("idle");
  const [verificationStep, setVerificationStep] = useState<number>(1);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [compareModalPurpose, setCompareModalPurpose] = useState<
    "compare" | "postBooking" | null
  >("compare");
  const [showBookingModal, setShowBookingModal] = useState<string | null>(null);
  const [selectedDentistId, setSelectedDentistId] = useState<string | null>(
    null,
  );
  const [schedule, setSchedule] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("estimate");
  const [dentistsToCompare, setDentistsToCompare] = useState<Dentist[]>([]);

  // Initialize storage data on mount
  useEffect(() => {
    initializeDentistData();
    initializeBookingData();
  }, []);

  const value = {
    verificationStatus,
    setVerificationStatus,
    verificationStep,
    setVerificationStep,
    showSignupModal,
    setShowSignupModal,
    showPersonalizeModal,
    setShowPersonalizeModal,
    showCompareModal,
    setShowCompareModal,
    compareModalPurpose,
    setCompareModalPurpose,
    showBookingModal,
    setShowBookingModal,
    selectedDentistId,
    setSelectedDentistId,
    schedule,
    setSchedule,
    activeTab,
    setActiveTab,
    dentistsToCompare,
    setDentistsToCompare,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};
export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
