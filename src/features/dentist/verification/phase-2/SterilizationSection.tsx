import { useFormContext } from "react-hook-form";
import { UploadCloud, Check, XCircle } from "lucide-react";
import PhaseStep from "../PhaseStep";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SterilizationSectionProps {
  disabled?: boolean;
}

export const SterilizationSection = ({ disabled }: SterilizationSectionProps) => {
  const { setValue, setError, clearErrors, watch, formState: { errors } } = useFormContext();
  const jciFile = watch("jciCertificate");
  const videoFile = watch("videoWalkthrough");

  const jciInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const methods = ["Autoclave", "Sealed Pouch", "Ultrasonic"];

  const getFileName = (fileValue: any) => {
    if (!fileValue) return "";
    if (fileValue instanceof File) return fileValue.name;
    if (typeof fileValue === "string") {
      return fileValue.substring(fileValue.lastIndexOf("/") + 1);
    }
    return "";
  };

  return (
    <section className="grid grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <PhaseStep step={1} title="Sterilization" />

      <div className="space-y-6">
        {/* General JCI / Video Upload Error Alert */}
        {(errors.jciCertificate || errors.videoWalkthrough) && (
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-semibold flex gap-2.5 animate-in fade-in slide-in-from-top-1">
            <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Sterilization Document Required</p>
              <p className="font-normal text-xs mt-0.5 text-red-500">
                Either JCI Certificate or Walkthrough Video file must be uploaded.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <label className="inline-block text-sm font-medium text-foreground">
            Upload JCI Certificate
          </label>
          <input
            type="file"
            className="hidden"
            ref={jciInputRef}
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  setError("jciCertificate", {
                    type: "manual",
                    message: "File size is too large. Maximum allowed size is 5MB.",
                  });
                  setValue("jciCertificate", null, { shouldValidate: true });
                  if (jciInputRef.current) jciInputRef.current.value = "";
                } else {
                  setValue("jciCertificate", file, { shouldValidate: true });
                  clearErrors(["jciCertificate", "videoWalkthrough"]);
                }
              }
            }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div
            onClick={() => !disabled && jciInputRef.current?.click()}
            className={cn(
              "group flex items-center justify-between rounded-lg border border-dashed px-4 py-4 transition-all sm:px-5",
              errors.jciCertificate ? "border-red-500 bg-red-50/10 animate-shake" : "border-primary",
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-card"
            )}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium text-[#0A2533]">
                {jciFile ? getFileName(jciFile) : "Click to upload or drag and drop"}
              </span>
            </div>
            {jciFile && (
              <span className="text-xs text-muted-foreground">
                {(jciFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
          {errors.jciCertificate && (
            <p className="text-xs font-semibold text-destructive mt-1">
              {String(errors.jciCertificate.message)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <span>Or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <label className="inline-block text-sm font-medium text-foreground">
            Start Video Walkthrough
          </label>
          <input
            type="file"
            className="hidden"
            ref={videoInputRef}
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 5 * 1024 * 1024) {
                  setError("videoWalkthrough", {
                    type: "manual",
                    message: "File size is too large. Maximum allowed size is 5MB.",
                  });
                  setValue("videoWalkthrough", null, { shouldValidate: true });
                  if (videoInputRef.current) videoInputRef.current.value = "";
                } else {
                  setValue("videoWalkthrough", file, { shouldValidate: true });
                  clearErrors(["videoWalkthrough", "jciCertificate"]);
                }
              }
            }}
            accept="video/*"
          />
          <div
            onClick={() => !disabled && videoInputRef.current?.click()}
            className={cn(
              "group flex items-center justify-between rounded-lg border border-dashed px-4 py-4 sm:px-5",
              errors.videoWalkthrough ? "border-red-500 bg-red-50/10 animate-shake" : "border-primary",
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-card"
            )}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium text-[#0A2533]">
                {videoFile ? getFileName(videoFile) : "Upload Video"}
              </span>
            </div>
            {videoFile && (
              <span className="text-xs text-muted-foreground">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
          {errors.videoWalkthrough && (
            <p className="text-xs font-semibold text-destructive mt-1">
              {String(errors.videoWalkthrough.message)}
            </p>
          )}
        </div>

        <div className="space-y-3 text-sm text-foreground">
          {methods.map((method) => (
            <div key={method} className="flex items-start gap-3">
              <span className="min-w-0">
                <span className="block font-medium text-foreground">
                  {method}
                </span>
                <span className="mt-0.5 block text-xs text-[#1A1A2E80]">
                  {method === "Autoclave" &&
                    "Film the brand name clearly for at least 3 seconds."}
                  {method === "Sealed Pouch" &&
                    "Show a sealed pouch with the chemical indicator clearly visible."}
                  {method === "Ultrasonic" &&
                    "Show the ultrasonic cleaner and your instrument trays."}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
