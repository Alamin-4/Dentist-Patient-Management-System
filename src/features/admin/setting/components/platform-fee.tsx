"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Info } from "lucide-react";
import { platformFeeSchema, type PlatformFeeFormValues } from "@/validation/settings-schemas";
import { bindServerErrors } from "@/core/hooks/admin/settings/useAdminSettings";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

/**
 * =============================================================================
 * INSTRUCTION: PLATFORM FEE WITH ZOD VALIDATION & FIELD ERRORS
 * =============================================================================
 * - Uses `react-hook-form` + `zodResolver(platformFeeSchema)`.
 * - Validation errors are rendered underneath the fee rate input.
 * - API error responses bind to form fields via `bindServerErrors(err, setError)`.
 * =============================================================================
 */

export function PlatformFee() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PlatformFeeFormValues>({
    resolver: zodResolver(platformFeeSchema),
    defaultValues: {
      rate: 10,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("rateddocs_platform_fee_rate");
    if (saved) {
      setValue("rate", Number(saved) || 10);
    }
  }, [setValue]);

  const onSubmit = async (data: PlatformFeeFormValues) => {
    try {
      await new Promise((r) => setTimeout(r, 400)); // Simulating API call
      localStorage.setItem("rateddocs_platform_fee_rate", String(data.rate));
      toast.success("Platform fee rate saved successfully.");
    } catch (err: any) {
      bindServerErrors(err, setError);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-base font-bold text-text">Platform Fee</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Set the percentage RatedDocs earns from each successfully completed booking.
        </p>
      </div>

      {/* Fee rate */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-text">Fee rate percentage</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <input
              type="number"
              step={0.1}
              {...register("rate", { valueAsNumber: true })}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault();
              }}
              className={cn(
                "h-10 w-full rounded-lg border px-4 pr-10 text-xs font-semibold outline-none transition-colors bg-white",
                errors.rate ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-primary"
              )}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
          </div>
        </div>

        {/* Inline Error Message */}
        {errors.rate && (
          <p className="text-[11px] text-red-500 font-semibold">{errors.rate.message}</p>
        )}

        <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Applied after successful treatment completion and escrow release.
        </p>
      </div>

      {/* Save */}
      <div className="flex justify-end border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-lg bg-primary hover:bg-[#0d3656] text-white px-5 py-2.5 text-xs font-bold transition-all cursor-pointer disabled:bg-slate-300"
        >
          <Save className="h-4 w-4" />
          {isSubmitting ? "Saving…" : "Save Fee Rate"}
        </button>
      </div>
    </form>
  );
}
