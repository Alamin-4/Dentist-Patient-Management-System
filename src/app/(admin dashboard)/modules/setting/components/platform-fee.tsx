"use client";

import { useState } from "react";
import { Save, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { PlatformFeeData } from "@/lib/settings-data";

interface PlatformFeeProps {
  initialFee: PlatformFeeData;
}

export function PlatformFee({ initialFee }: PlatformFeeProps) {
  const [rate, setRate] = useState(initialFee.rate);
  const [saving, setSaving] = useState(false);

  const isValid = rate >= 0 && rate <= 100;

  const handleSave = async () => {
    if (!isValid) {
      toast.error("Fee rate must be between 0 and 100.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Platform fee saved.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5">
        <h2 className="text-base font-bold text-[#1A1A2E]">Platform Fee</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Set the percentage RatedDocs earns from each successfully completed booking.
        </p>
      </div>

      {/* Fee rate */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-[#1A1A2E]">Fee rate</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <input
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
              className={cn(
                "h-11 w-full rounded-xl border px-4 pr-10 text-sm font-medium outline-none transition-colors",
                "border-gray-200 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E]"
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">%</span>
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Applied after successful treatment completion and escrow release.
        </p>
      </div>

      {/* Save */}
      <div className="flex justify-end border-t border-gray-100 pt-5">
        <button
          onClick={handleSave}
          disabled={saving || !isValid}
          className={cn(
            "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-95",
            isValid ? "bg-[#1A1A2E] hover:bg-[#1A1A2E]/90" : "cursor-not-allowed bg-gray-300"
          )}
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save fee"}
        </button>
      </div>
    </div>
  );
}
