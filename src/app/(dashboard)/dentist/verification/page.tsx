"use client";

import { useStateContext } from "@/providers/StateProvider";
import Phase1 from "../../../modules/dentist/verification/phase-1/Phase1";
import MultiStepForm from "../../../modules/dentist/verification/phase-2/MultiStepForm";
import Phase3 from "../../../modules/dentist/verification/Phase-3/Phase3";

export default function PhaseOnePage() {
  const { verificationStep } = useStateContext();

  return (
    <>
      {verificationStep === 1 && <Phase1 />}
      {verificationStep === 2 && <MultiStepForm />}
      {verificationStep === 3 && <Phase3 />}
    </>
  );
}
