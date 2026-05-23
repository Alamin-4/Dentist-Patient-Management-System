"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleGoToBookings = () => {
    onClose();
    router.push("/patient/bookings");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-2xl p-8 lg:p-12 border-none bg-white rounded-3xl flex flex-col items-center justify-center [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="hidden">Treatment deposit secured</DialogTitle>
        </DialogHeader>

        <div className="text-center flex flex-col items-center">
          <div className="size-20 bg-[#0F3659] rounded-full flex items-center justify-center mb-8 shadow-lg">
            <Check className="size-10 text-white stroke-[2.5]" />
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A1A2E] mb-4">
            Treatment deposit secured
          </h2>

          <p className="text-[#64748B] max-w-md text-center leading-relaxed mb-8">
            Your payment is safely held in escrow. Your dentist will now share
            available treatment dates and appointment slots based on your
            preferred travel window.
          </p>

          <button
            type="button"
            onClick={handleGoToBookings}
            className="px-8 py-3.5 bg-[#0F3659] hover:bg-[#0A2640] text-white font-bold text-[15px] rounded-xl active:scale-95 transition-all"
          >
            Go to My Bookings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessModal;
