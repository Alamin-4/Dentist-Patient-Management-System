"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useStateContext } from "@/providers/StateProvider";
import { setBookingCurrentStep } from "@/lib/storage/bookingService";
import { useAppStore } from "@/store/useAppStore";
import { usePathname } from "next/navigation";

const CHECKLIST = [
  "Clear dental photos",
  "Recent X-rays, if available",
  "Any relevant dental records or treatment history",
];

export default function StartBookingModal() {
  const [agreed, setAgreed] = useState(false);
  const { setShowBookingModal, showBookingModal, bookingMode } = useStateContext();
  const store = useAppStore();
  const pathname = usePathname();

  /**
   * Transition from "startBooking" → "booking" in a single URL replace call.
   * Using router.replace instead of the default push-based setShowBookingModal
   * avoids stacking a ?modal=start-booking entry in history that users could
   * navigate back to, which would leave the backdrop stuck.
   */
  const handleContinue = () => {
    // 1. Update Zustand immediately so Dialog visibility flips atomically.
    store.openModal("booking");
    // 2. Replace the URL so the browser history doesn't have start-booking → booking
    //    as two separate entries. We use window.history directly (synchronous) to
    //    avoid a Next.js router round-trip that could race with ModalSync.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      params.set("modal", "booking");
      const newUrl = pathname + "?" + params.toString();
      window.history.replaceState(null, "", newUrl);
    }
  };

  return (
    <Dialog
      open={showBookingModal === "startBooking"}
      onOpenChange={(open) => {
        if (!open && showBookingModal === "startBooking") {
          setShowBookingModal(null);
        }
      }}
    >
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-190 w-full p-0 border-none rounded-lg overflow-hidden bg-white"
      >
        <div className="px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[24px] font-bold text-[#1A1A2E]">
            {bookingMode === "request" ? "Request Consultation" : "Book Consultation"}
          </DialogTitle>
        </div>

        <div className="p-8">
          <p className="text-[18px] leading-relaxed text-[#1A1A2E] font-medium mb-8">
            To help your consultant review your case, please make sure you have
            the following ready before continuing.
          </p>

          {/* Static checklist — informational, already filled */}
          <div className="space-y-5 mb-8">
            {CHECKLIST.map((item) => (
              <div key={item} className="flex items-center gap-4">
                <CheckCircle2 className="shrink-0 w-5 h-5 text-[#113254] fill-[#113254] stroke-white" />
                <span className="text-[16px] font-semibold text-[#1A1A2E]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[#1A1A2E] text-[15px] leading-relaxed mb-8">
            RatedDocs reviews dentist data but does not provide treatment or
            guarantee outcomes.
          </p>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 mb-10">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-0.5 border-[#113254] data-[state=checked]:bg-[#113254]"
            />
            <label
              htmlFor="terms"
              className="text-[15px] text-[#1A1A2E] font-medium cursor-pointer leading-snug"
            >
              I have read and agree to the{" "}
              <a href="/terms" className="text-[#113254] underline underline-offset-4">
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-[#113254] underline underline-offset-4">
                Privacy Policy
              </a>
              , and Consent to Share Records.
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setBookingCurrentStep(1);
                setShowBookingModal("book");
              }}
              disabled={!agreed}
              className="px-10 py-4 rounded-lg text-[#FFFFFF] font-semibold text-[16px] transition-all bg-[#113254] hover:bg-[#0d2844] active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              {bookingMode === "request" ? "Continue to Request" : "Continue to Booking"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
