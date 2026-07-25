"use client";

import { useFormContext } from "react-hook-form";
import PhaseStep from "../PhaseStep";
import { FileUpload } from "./FileUpload";

interface SterilizationSectionProps {
  disabled?: boolean;
}

export const SterilizationSection = ({ disabled }: SterilizationSectionProps) => {
  const { formState: { errors } } = useFormContext();
  const hasSterilizationError = !!errors.jciCertificate || !!errors.videoWalkthrough;

  return (
    <section className="grid grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <PhaseStep step={1} title="Sterilization" />

      <div className="space-y-6">
        {hasSterilizationError && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm flex gap-3 animate-in fade-in slide-in-from-top-1">
            <span className="font-semibold">Action Required:</span>
            <span>You must upload either a JCI Certificate or a Video Walkthrough to proceed.</span>
          </div>
        )}

        <FileUpload
          name="jciCertificate"
          label="Upload JCI Certificate"
          accept=".pdf"
          disabled={disabled}
          helperText="Accepted format: PDF only (Max 5MB)"
        />

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>Or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <FileUpload
          name="videoWalkthrough"
          label="Start Video Walkthrough"
          accept="video/*"
          disabled={disabled}
          helperText="Show Autoclave, Sealed Pouch, and Ultrasonic cleaner clearly (Max 5MB)"
        />
      </div>
    </section>
  );
};