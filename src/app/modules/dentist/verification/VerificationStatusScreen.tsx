"use client";

import { Clock, XCircle } from "lucide-react";

interface VerificationStatusScreenProps {
  status: "SUBMITTED" | "REJECTED";
  phaseName: string;
  rejectionNote?: string;
}

export function VerificationStatusScreen({
  status,
  phaseName,
  rejectionNote,
}: VerificationStatusScreenProps) {
  if (status === "SUBMITTED") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
          <Clock className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">
          {phaseName} Under Review
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your submission is being reviewed by our team. This usually takes 1–2 business days.
          You&apos;ll be notified once it&apos;s approved.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-200">
        <XCircle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">
        {phaseName} Rejected
      </h3>
      {rejectionNote && (
        <p className="max-w-sm text-sm text-muted-foreground border border-red-100 bg-red-50 rounded-lg px-4 py-3">
          {rejectionNote}
        </p>
      )}
      <p className="max-w-sm text-sm text-muted-foreground">
        Please review the feedback above and resubmit your documents below.
      </p>
    </div>
  );
}
