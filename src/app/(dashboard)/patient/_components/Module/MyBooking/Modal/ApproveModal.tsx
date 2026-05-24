"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ConfirmReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  paymentCode: string;
}

export function ConfirmReleaseModal({
  isOpen,
  onClose,
  doctorName,
  paymentCode,
}: ConfirmReleaseModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg p-8 gap-5 border-none rounded-3xl shadow-xl">
        {/* Custom close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer"
        >
          <X className="size-5" />
        </button>

        <h2 className="text-2xl font-bold text-[#1A1A2E] pr-8 leading-snug">
          Confirm &amp; Release Payment
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          To release payment to {doctorName} and begin treatment, please share
          the code below with the doctor when you arrive at the clinic.
        </p>

        <p className="text-5xl font-bold text-[#1A1A2E] tracking-widest mt-1">
          {paymentCode}
        </p>
      </DialogContent>
    </Dialog>
  );
}
