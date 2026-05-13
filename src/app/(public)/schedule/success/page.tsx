"use client";

import { Suspense } from "react";
import SuccessContent from "./_components/SuccessContent";

export default function SuccessScheduleBooking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
