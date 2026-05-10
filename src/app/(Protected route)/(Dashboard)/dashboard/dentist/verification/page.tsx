"use client";

import { useStateContext } from "@/providers/StateProvider";
import Phase1 from "../../../_components/module/verification/phase-1/Phase1";
import MultiStepForm from "../../../_components/module/verification/phase-2/MultiStepForm";
import Phase3 from "../../../_components/module/verification/Phase-3/Phase3";

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
