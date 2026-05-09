'use client'

import React, { createContext, useContext, useState } from "react";

interface StateContextType {
  verificationStatus: "idle" | "match" | "no-match";
  setVerificationStatus: React.Dispatch<
    React.SetStateAction<"idle" | "match" | "no-match">
  >;
  verificationStep: number;
  setVerificationStep: React.Dispatch<React.SetStateAction<number>>;
}

export const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "match" | "no-match"
  >("idle");
  const [verificationStep, setVerificationStep] = useState<number>(1);

  const value = {
    verificationStatus,
    setVerificationStatus,
    verificationStep,
    setVerificationStep,
  };

  return (
    <StateContext.Provider value={value}>{children}</StateContext.Provider>
  );
};
// Custom hook for easier context consumption
export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
}