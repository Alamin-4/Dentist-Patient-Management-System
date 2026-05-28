"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface DeactivateModalProps {
  open: boolean;
  kolName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeactivateModal({ open, kolName, onClose, onConfirm }: DeactivateModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <h3 className="text-base font-bold text-[#1A1A2E]">
            Remove {kolName} from the KOL directory?
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            They will no longer be visible to dentists immediately. You can reactivate them at any time.
          </p>
          <div className="mt-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
