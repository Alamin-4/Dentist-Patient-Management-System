"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Megaphone } from "lucide-react";
import { announcementSchema, type AnnouncementFormValues, type AnnouncementAudience } from "@/validation/settings-schemas";
import { bindServerErrors } from "@/core/hooks/admin/settings/useAdminSettings";
import { cn } from "@/lib/utils";

export type { AnnouncementAudience };

interface NewAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (data: { title: string; message: string; audience: AnnouncementAudience }) => void;
}

const AUDIENCE_OPTIONS: { value: AnnouncementAudience; label: string }[] = [
  { value: "all", label: "All users" },
  { value: "patients", label: "Patients only" },
  { value: "dentists", label: "Dentists only" },
];

/**
 * =============================================================================
 * INSTRUCTION: ANNOUNCEMENT MODAL WITH ZOD VALIDATION & FIELD ERRORS
 * =============================================================================
 * - Uses `react-hook-form` + `zodResolver(announcementSchema)`.
 * - Inline field validation errors appear directly below each field.
 * - API error responses bind to form fields via `bindServerErrors(err, setError)`.
 * =============================================================================
 */

export function NewAnnouncementModal({ open, onClose, onPublish }: NewAnnouncementModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: "",
      message: "",
      audience: "all",
    },
  });

  const selectedAudience = watch("audience");

  if (!open) return null;

  const onSubmit = async (data: AnnouncementFormValues) => {
    try {
      await new Promise((r) => setTimeout(r, 400));
      onPublish(data);
      reset();
    } catch (err: any) {
      bindServerErrors(err, setError);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md rounded-xl bg-white border border-slate-300 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start gap-3 border-b border-slate-200 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
              <Megaphone className="h-4 w-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#1A1A2E]">New announcement</h3>
              <p className="text-xs text-slate-500">Broadcast a message to platform users</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 p-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1A1A2E]">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("title")}
                placeholder="e.g. Scheduled maintenance on May 15"
                className={cn(
                  "h-9 w-full rounded-lg border px-3 text-xs outline-none transition-colors",
                  errors.title ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                )}
              />
              {errors.title && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.title.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1A1A2E]">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register("message")}
                placeholder="Write the announcement body. Keep it clear and concise."
                className={cn(
                  "w-full resize-none rounded-lg border p-3 text-xs outline-none transition-colors",
                  errors.message ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-[#10436B]"
                )}
              />
              {errors.message && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.message.message}</p>
              )}
            </div>

            {/* Audience */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-[#1A1A2E]">Send to</label>
              <div className="flex gap-2">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setValue("audience", opt.value, { shouldValidate: true })}
                    className={cn(
                      "flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors cursor-pointer",
                      selectedAudience === opt.value
                        ? "border-[#10436B] bg-[#10436B] text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {errors.audience && (
                <p className="text-[11px] text-red-500 font-semibold">{errors.audience.message}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-[#10436B] hover:bg-[#0d3656] px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer disabled:bg-slate-300"
            >
              <Megaphone className="h-3.5 w-3.5" />
              {isSubmitting ? "Publishing…" : "Publish Now"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
