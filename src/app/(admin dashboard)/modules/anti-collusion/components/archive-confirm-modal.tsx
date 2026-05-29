"use client";

import { useEffect } from "react";

interface ArchiveConfirmModalProps {
  open: boolean;
  dentistName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ArchiveConfirmModal({ open, dentistName, onClose, onConfirm }: ArchiveConfirmModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
          <h3 className="text-base font-bold text-[#1A1A2E]">Archive {dentistName}?</h3>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Their profile will be hidden from patient search and they cannot accept new bookings.
            Active bookings will continue unaffected. This can be reversed — you can reactivate them
            from the archive at any time.
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
              Archive Dentist
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
