"use client";

import { useStateContext } from "@/providers/StateProvider";
import { VerificationBanner } from "./verification-banner";
import MainOverviewPage from "./main-overview-page";

export function OverviewPageSwitcher() {
  const { verificationStep, verificationCompletedStep } = useStateContext();

  const isVerified = (verificationCompletedStep ?? 0) >= 3 || verificationStep >= 3;

  return isVerified ? <MainOverviewPage /> : <VerificationBanner />;
}
