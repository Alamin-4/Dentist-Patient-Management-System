"use client";

import { Suspense } from "react";
import ScheduleContent from "./_components/ScheduleContent";

export default function Schedule() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScheduleContent />
    </Suspense>
  );
}
