"use client";

import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSuccessModal = ({ isOpen, onClose }: PaymentSuccessModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl p-6 lg:p-12 border-none bg-white rounded-2xl flex flex-col items-center justify-center m-0 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="hidden">
            Treatment deposit secured
          </DialogTitle>
        </DialogHeader>

        <div className="text-center flex flex-col items-center animate-in rounded-2xl fade-in zoom-in duration-300">
          <div className="size-24 bg-[#0F3659] rounded-full flex items-center justify-center mb-10 shadow-lg">
            <Check className="size-12 text-white stroke-[3px]" />
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] mb-6">
            Treatment deposit secured
          </h2>

          <p className="text-[#64748B] max-w-xl mb-6">
            Your payment is safely held in escrow. Your dentist will now share
            available treatment dates and appointment slots based on your
            preferred travel window.
          </p>

          <button
            onClick={onClose}
            className="bg-[#0F3659] hover:bg-[#0A2640] text-white px-6 py-3 font-semibold rounded-lg active:scale-95"
          >
            View treatment scheduling
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
