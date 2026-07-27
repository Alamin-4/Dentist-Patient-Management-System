"use client";

import { useState, useEffect } from "react";
import { Save, Info, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  useVerificationWeights,
  useUpdateVerificationWeights,
} from "@/hooks/admin/verifications/useVerifications";

export function RdvScoreWeights() {
  const { data, isLoading, isError } = useVerificationWeights();
  const updateMutation = useUpdateVerificationWeights();

  const [licenseWeight, setLicenseWeight] = useState(30);
  const [operationsWeight, setOperationsWeight] = useState(40);
  const [clinicDepthWeight, setClinicDepthWeight] = useState(30);

  useEffect(() => {
    if (data) {
      setLicenseWeight(data.licenseWeight);
      setOperationsWeight(data.operationsWeight);
      setClinicDepthWeight(data.clinicDepthWeight);
    }
  }, [data]);

  const total = Number(licenseWeight) + Number(operationsWeight) + Number(clinicDepthWeight);
  const isValid = total === 100;

  const handleSave = async () => {
    if (!isValid) {
      toast.error("Weights must total exactly 100%.");
      return;
    }

    const toastId = toast.loading("Saving score weights...");
    try {
      await updateMutation.mutateAsync({
        licenseWeight,
        operationsWeight,
        clinicDepthWeight,
      });
      toast.success("Score weights saved successfully.", { id: toastId });
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to save weights.";
      toast.error(errMsg, { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-50 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-50 items-center justify-center text-red-500 font-semibold text-xs">
        Failed to load score weights.
      </div>
    );
  }

  const phases = [
    {
      id: "license",
      label: "Phase 1 — License Verification",
      meta: "~5 min · RDV +30%",
      weight: licenseWeight,
      setter: setLicenseWeight,
    },
    {
      id: "operations",
      label: "Phase 2 — Operations",
      meta: "~20–30 min · RDV +40%",
      weight: operationsWeight,
      setter: setOperationsWeight,
    },
    {
      id: "clinicDepth",
      label: "Phase 3 — Clinical depth",
      meta: "Async · RDV +30%",
      weight: clinicDepthWeight,
      setter: setClinicDepthWeight,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E]">RDV Score Weights</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Set the RDV score contribution for each verification phase. Total must equal 100%.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border",
            isValid
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          )}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Total: {total}%
        </span>
      </div>

      {/* Phase rows */}
      <div className="flex flex-col divide-y divide-slate-100">
        {phases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-slate-300 bg-slate-100" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1A1A2E]">{phase.label}</p>
              <p className="text-[11px] text-slate-400">{phase.meta}</p>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") e.preventDefault();
                }}
                value={phase.weight}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                  phase.setter(val);
                }}
                className={cn(
                  "h-9 w-20 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-right outline-none transition-colors",
                  "focus:border-[#10436B]"
                )}
              />
              <span className="text-xs font-bold text-slate-400">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Changes take effect on the next daily score recalculation.
        </p>
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending || !isValid}
          className={cn(
            "flex items-center gap-2 rounded-lg px-5 py-2 text-xs font-bold text-white transition-all cursor-pointer",
            isValid && !updateMutation.isPending
              ? "bg-[#10436B] hover:bg-[#0d3656]"
              : "cursor-not-allowed bg-slate-300"
          )}
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {updateMutation.isPending ? "Saving…" : "Save Weights"}
        </button>
      </div>
    </div>
  );
}
