"use client";

import { useEffect } from "react";
import { CheckCircle2, X, Loader2 } from "lucide-react";

interface ApprovePhaseModalProps {
  open: boolean;
  phaseLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ApprovePhaseModal({
  open,
  phaseLabel,
  onClose,
  onConfirm,
  isPending,
}: ApprovePhaseModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={isPending ? undefined : onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-500">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1A1A2E]">
                  Approve {phaseLabel}?
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  This action will approve the submitted data and notify the dentist.
                </p>
              </div>
            </div>
            <button
              disabled={isPending}
              onClick={onClose}
              className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Info box */}
          <div className="mt-4 flex items-start gap-2.5 rounded-lg bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <p className="text-sm text-emerald-700">
              Once approved, the dentist will be notified and their RDV score will be updated accordingly.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <button
              disabled={isPending}
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#1A1A2E] transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              disabled={isPending}
              onClick={onConfirm}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {isPending ? "Approving..." : "Confirm Approval"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
