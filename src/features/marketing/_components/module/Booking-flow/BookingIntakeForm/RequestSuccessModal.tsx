"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface RequestSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RequestSuccessModal({ open, onClose }: RequestSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl"
      >
        <DialogTitle className="sr-only">Request Submitted Successfully</DialogTitle>

        <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
          {/* Check icon matching design pattern */}
          <div className="size-16 rounded-full bg-[#113254] flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="size-9 text-white fill-white stroke-[#113254]" />
          </div>

          {/* Title */}
          <h2 className="text-[22px] font-black text-[#1A1A2E] mb-2">
            Request Submitted Successfully
          </h2>

          {/* Description */}
          <p className="text-[14px] text-[#6B7280] leading-relaxed max-w-sm mb-6">
            Your request has been successfully sent to the dentist. You can create the meeting schedule after the dentist reviews and accepts the consultation request.
          </p>

          {/* Action button */}
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-semibold text-[15px] rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            Go to my Bookings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
