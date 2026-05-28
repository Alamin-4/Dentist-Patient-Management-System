"use client";

import { useEffect } from "react";

interface ReactivateConfirmModalProps {
  open: boolean;
  dentistName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReactivateConfirmModal({ open, dentistName, onClose, onConfirm }: ReactivateConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
          <h3 className="text-base font-bold text-[#1A1A2E]">Reactivate {dentistName}?</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Their profile will become visible in patient search immediately and they can accept new
            bookings. Their flag history remains on record. A further price variance violation will
            trigger automatic suspension.
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
              className="flex-1 rounded-lg bg-[#1A1A2E] py-2.5 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
            >
              Confirm Reactivation
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
