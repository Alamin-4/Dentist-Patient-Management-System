"use client";

import { useState } from "react";
import { Save, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { RdvPhaseWeight } from "@/lib/settings-data";

interface RdvScoreWeightsProps {
  initialWeights: RdvPhaseWeight[];
}

export function RdvScoreWeights({ initialWeights }: RdvScoreWeightsProps) {
  const [weights, setWeights] = useState<RdvPhaseWeight[]>(initialWeights);
  const [saving, setSaving] = useState(false);

  const total = weights.reduce((sum, p) => sum + (Number(p.weight) || 0), 0);
  const isValid = total === 100;

  const handleChange = (id: string, raw: string) => {
    const val = Math.max(0, Math.min(100, Number(raw) || 0));
    setWeights((prev) => prev.map((p) => (p.id === id ? { ...p, weight: val } : p)));
  };

  const handleSave = async () => {
    if (!isValid) {
      toast.error("Weights must total exactly 100%.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Score weights saved.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-base font-bold text-[#1A1A2E]">RDV Score Weights</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Set the RDV score contribution for each verification phase. Total must equal 100%.
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
            isValid
              ? "bg-success-50 text-success-700"
              : "bg-destructive-50 text-destructive-700"
          )}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Total: {total}%
        </span>
      </div>

      {/* Phase rows */}
      <div className="flex flex-col divide-y divide-gray-50">
        {weights.map((phase) => (
          <div key={phase.id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-gray-300" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#1A1A2E]">{phase.label}</p>
              <p className="text-xs text-gray-400">{phase.meta}</p>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                value={phase.weight}
                onChange={(e) => handleChange(phase.id, e.target.value)}
                className={cn(
                  "h-9 w-20 rounded-lg border px-3 text-sm font-medium text-right outline-none transition-colors",
                  "border-gray-200 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
                )}
              />
              <span className="text-sm font-medium text-gray-400">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Changes take effect on the next daily score recalculation.
        </p>
        <button
          onClick={handleSave}
          disabled={saving || !isValid}
          className={cn(
            "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95",
            isValid
              ? "bg-[#1A1A2E] hover:bg-[#1A1A2E]/90"
              : "cursor-not-allowed bg-gray-300"
          )}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save weights"}
        </button>
      </div>
    </div>
  );
}
