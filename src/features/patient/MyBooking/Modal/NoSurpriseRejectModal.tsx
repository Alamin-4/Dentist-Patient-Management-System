"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NoSurpriseRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function NoSurpriseRejectModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: NoSurpriseRejectModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-lg p-8 gap-6 border-none rounded-3xl shadow">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-text text-left leading-snug">
            Rejected Plan No Surprise Guarantee
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-600 leading-relaxed -mt-2">
          The final price exceeds the 15% leeway. Rejecting will trigger the No
          Surprise Guarantee and a full refund.
        </p>

        <div className="space-y-2">
          <label className="text-[15px] font-semibold text-text">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter Reason"
            rows={4}
            disabled={isLoading}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-text placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3659] resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg border border-slate-300 font-bold text-text hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 py-3 rounded-lg bg-[#0F3659] font-bold text-white hover:bg-[#0A2640] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? "Rejecting..." : "Yes Reject"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
