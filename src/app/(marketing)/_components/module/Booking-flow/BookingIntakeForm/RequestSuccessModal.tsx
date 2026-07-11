"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface RequestSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RequestSuccessModal({ open, onClose }: RequestSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl p-8 lg:p-12 border-none bg-white rounded-3xl flex flex-col items-center justify-center [&>button]:hidden">
        <div className="text-center flex flex-col items-center">
          <div className="size-20 bg-[#0E3E65] rounded-full flex items-center justify-center mb-8 shadow-lg">
            <Check className="size-10 text-white stroke-[2.5]" />
          </div>

          <DialogTitle className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] mb-4">
            Request Submitted Successfully
          </DialogTitle>

          <p className="text-[#64748B] max-w-md text-center leading-relaxed mb-8">
            Your request has been successfully sent to the dentist. You can create the meeting schedule after the dentist reviews and accepts the consultation request.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3.5 bg-[#0E3E65] hover:bg-[#0A2640] text-white font-bold text-[15px] rounded-lg active:scale-95 transition-all"
          >
            Go to My Bookings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
