"use client";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const guidelineImages = [
  { id: 1, title: "Front Smile", src: "/path-to-img1.jpg" },
  { id: 2, title: "Wide Smile", src: "/path-to-img2.jpg" },
  { id: 3, title: "Upper Arch", src: "/path-to-img3.jpg" },
  { id: 1, title: "Lower Arch", src: "/path-to-img4.jpg" },
  { id: 2, title: "Left Side", src: "/path-to-img5.jpg" },
  { id: 3, title: "Right Side", src: "/path-to-img6.jpg" },
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
      <DialogContent className="sm:max-w-7xl w-full p-0 border-none rounded-3xl overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <DialogTitle className="text-[20px] font-bold text-[#1A1A2E]">
            Book Consulting
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
          {guidelineImages.map((item, index) => (
            <div key={index} className="flex flex-col gap-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                {/* Number Badge from image_e09ab8.jpg */}
                <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                  <span className="text-[#113254] font-bold text-[14px]">
                    {item.id}
                  </span>
                </div>

                {/* Image Placeholder */}
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[#113254] font-bold text-[16px] px-1">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
