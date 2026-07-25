"use client";

import { useFormContext } from "react-hook-form";

export const GuaranteeSection = ({ disabled }: { disabled?: boolean }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <section className="grid grid-cols-1 gap-8 border-t border-border px-5 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] lg:px-8 lg:py-8">
      <div className="space-y-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Step 3</span>
          <h2 className="mt-1 text-2xl font-semibold text-foreground">No Surprise Guarantee</h2>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 sm:p-5">
          <p className="text-sm font-medium text-primary">
            You agree that final treatment prices will remain within 15% of your quoted estimate unless approved by the patient.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Signer Full Name *</label>
            <input
              disabled={disabled}
              {...register("signerFullName")}
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
            />
            {errors.signerFullName && <p className="text-xs font-semibold text-destructive">{String(errors.signerFullName.message)}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Typed Signature *</label>
            <input
              disabled={disabled}
              {...register("typedSignature")}
              className="h-12 w-full rounded-lg border border-border bg-card px-4 text-sm italic outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:opacity-60"
            />
            {errors.typedSignature && <p className="text-xs font-semibold text-destructive">{String(errors.typedSignature.message)}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={`flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-muted/50"}`}>
            <input
              type="checkbox"
              disabled={disabled}
              {...register("agreeToGuarantee")}
              className="mt-0.5 size-4 rounded border-border text-primary focus:ring-primary/40 disabled:cursor-not-allowed"
            />
            <span className="text-sm leading-6 text-muted-foreground">
              I agree to keep final prices within 15% unless approved by the patient. *
            </span>
          </label>
          {errors.agreeToGuarantee && <p className="text-xs font-semibold text-destructive">{String(errors.agreeToGuarantee.message)}</p>}
        </div>
      </div>
    </section>
  );
};