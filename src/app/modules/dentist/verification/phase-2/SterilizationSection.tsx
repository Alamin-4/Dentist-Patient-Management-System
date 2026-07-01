import { useFormContext } from "react-hook-form";
import { UploadCloud, Check } from "lucide-react";
import PhaseStep from "../PhaseStep";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface SterilizationSectionProps {
  disabled?: boolean;
}

export const SterilizationSection = ({ disabled }: SterilizationSectionProps) => {
  const { setValue, watch } = useFormContext();
  const jciFile = watch("jciCertificate");
  const videoFile = watch("videoWalkthrough");

  const jciInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const methods = ["Autoclave", "Sealed Pouch", "Ultrasonic"];

  return (
    <section className="grid grid-cols-1 gap-8 px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <PhaseStep step={1} title="Sterilization" />

      <div className="space-y-6">
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
              if (file)
                setValue("jciCertificate", file, { shouldValidate: true });
            }}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <div
            onClick={() => !disabled && jciInputRef.current?.click()}
            className={cn(
              "group flex items-center justify-between rounded-lg border border-dashed px-4 py-4 transition-all border-primary sm:px-5",
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-card"
            )}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium text-[#0A2533]">
                {jciFile ? jciFile.name : "Click to upload or drag and drop"}
              </span>
            </div>
            {jciFile && (
              <span className="text-xs text-muted-foreground">
                {(jciFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
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
              if (file)
                setValue("videoWalkthrough", file, { shouldValidate: true });
            }}
            accept="video/*"
          />
          <div
            onClick={() => !disabled && videoInputRef.current?.click()}
            className={cn(
              "group flex items-center justify-between rounded-lg border border-dashed px-4 py-4 border-primary sm:px-5",
              disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-card"
            )}
          >
            <div className="flex items-center gap-3">
              <UploadCloud className="size-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-sm font-medium text-[#0A2533]">
                {videoFile ? videoFile.name : "Upload Video"}
              </span>
            </div>
            {videoFile && (
              <span className="text-xs text-muted-foreground">
                {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
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
