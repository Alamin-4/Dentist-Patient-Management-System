"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useStateContext } from "@/providers/StateProvider";

export default function StartBookingModal() {
  const [agreed, setAgreed] = useState(false);
  const { setShowBookingModal, showBookingModal } = useStateContext();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const checklist = [
    "Clear dental photos",
    "Recent X-rays, if available",
    "Any relevant dental records or treatment history",
  ];

  return (
    <Dialog
      open={showBookingModal === "startBooking"}
      onOpenChange={() => setShowBookingModal(null)}
    >
      <DialogContent className="sm:max-w-190 w-full p-0 border-none rounded-2xl overflow-hidden bg-white">
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[24px] font-bold text-[#1A1A2E]">
            Book Consulting
          </DialogTitle>
        </div>

        <div className="p-8">
          {/* Instructions */}
          <p className="text-[19px] leading-relaxed text-[#1A1A2E] font-medium mb-8 max-w-162.5">
            To help your consultant review your case, please make sure you have
            the following ready before continuing.
          </p>

          {/* Checklist items */}
          <div className="space-y-5 mb-10">
            {checklist.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div>
                  <button
                    onClick={() => {
                      if (checkedItems.includes(item)) {
                        setCheckedItems(checkedItems.filter((i) => i !== item));
                      } else {
                        setCheckedItems([...checkedItems, item]);
                      }
                    }}
                  >
                    {checkedItems.includes(item) ? (
                      <CheckCircle2 className="w-5 h-5 text-[#113254] fill-[#113254] stroke-white rounded-full" />
                    ) : (
                      <Circle className="w-5 h-5 text-[#113254] fill-[#F3F4F6] stroke-[#113254]" />
                    )}
                  </button>
                </div>
                <span className="text-[17px] font-semibold text-[#1A1A2E]">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Disclaimer Text */}
          <p className="text-[#1A1A2E] text-[16px] leading-[1.6] mb-8">
            by continuing, you acknowledge that Rateddocs is a platform that
            helps connect you with dental professionals. Rateddocs does not
            provide dental treatment or guarantee clinical outcomes.
          </p>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-3 mb-10">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
              className="mt-1 border-[#113254] data-[state=checked]:bg-[#113254]"
            />
            <label
              htmlFor="terms"
              className="text-[16px] text-[#1A1A2E] font-medium cursor-pointer leading-snug"
            >
              I have read and agree to the{" "}
              <a
                href="#"
                className="text-[#113254] underline underline-offset-4"
              >
                Terms & Conditions
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-[#113254] underline underline-offset-4"
              >
                Privacy Policy
              </a>
              , and Consent to Share Records.
            </label>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowBookingModal("book");
              }}
              disabled={!agreed}
              className={`px-10 py-4 rounded-xl text-white font-semibold text-[17px] transition-all
                ${
                  agreed
                    ? "bg-[#113254] hover:bg-[#0d2844] active:scale-95"
                    : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              Continue to Booking
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
