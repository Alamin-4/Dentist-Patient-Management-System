"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

const GUIDELINES = [
  {
    num: 1,
    title: "Front Smile",
    hint: "Teeth together, lips relaxed",
    bg: "/images/front-smile.png",
  },
  {
    num: 2,
    title: "Wide Smile",
    hint: "Smile as wide as possible",
    bg: "/images/wide-smile.png",
  },
  {
    num: 3,
    title: "Upper Arch",
    hint: "Tilt head back, mouth wide open",
    bg: "/images/upper-arach.png",
  },
  {
    num: 1,
    title: "Lower Arch",
    hint: "Chin down, mouth wide open",
    bg: "/images/lower-arch.png",
  },
  {
    num: 2,
    title: "Left Side",
    hint: "Turn head right, show left teeth",
    bg: "/images/left-side.png",
  },
  {
    num: 3,
    title: "Right Side",
    hint: "Turn head left, show right teeth",
    bg: "/images/right-side.png",
  },
];

export default function GuidelinesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl">
        <div className="px-8 py-6 border-b border-[#F3F4F6]">
          <DialogTitle className="text-[20px] font-bold text-[#1A1A2E]">
            Book Consultation
          </DialogTitle>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-6 bg-white">
          {GUIDELINES.map((item, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div
                className={`relative aspect-square rounded-lg overflow-hidden flex items-center justify-center`}
              >
                <Image src={item.bg} fill alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[#113254] font-bold text-sm">
                    {item.num}
                  </span>
                </div>

              </div>
              <span className="text-[#113254] font-bold text-[15px]">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
