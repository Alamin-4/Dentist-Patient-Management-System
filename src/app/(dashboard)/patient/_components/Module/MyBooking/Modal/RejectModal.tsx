"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectPlanModal({ isOpen, onClose, onConfirm }: RejectPlanModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-8 gap-6 border-none rounded-3xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1A1A2E] text-left">
            Reject Treatment Plan?
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <label className="text-[15px] font-semibold text-[#1A1A2E]">Reason</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter Reason"
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F3659] resize-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-[#1A1A2E] hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-[#0F3659] font-bold text-white hover:bg-[#0A2640] transition-colors active:scale-95"
          >
            Yes, Reject
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
