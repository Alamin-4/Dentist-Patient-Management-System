"use client";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const requiredPhotos = [
  { label: "Front smile — mouth wide open" },
  { label: "Wide smile — mouth wide open" },
  { label: "Lower arch — mouth wide open" },
];

const recommendedPhotos = [
  { label: "Upper arch — mouth wide open" },
  { label: "Left side" },
  { label: "Right side" },
];

export default function PhotoUploadForm() {
  const [showGuidelines, setShowGuidelines] = useState(false);

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      <h2 className="text-[22px] font-bold text-[#1A1A2E] mb-6">
        Upload your dental photos
      </h2>

      {/* Tip Banner */}
      <div className="flex items-center justify-between p-6 bg-[#F0F9FF] border border-[#E0F2FE] rounded-2xl mb-8">
        <div className="max-w-[70%]">
          <h4 className="font-bold text-[#1A1A2E] text-[16px] mb-1">
            Tip for best results
          </h4>
          <p className="text-[#6B7280] text-[14px] leading-relaxed">
            Stand near a window in natural light. Use your phone's front camera.
            Avoid flash — it washes out detail doctors need for an accurate
            estimate.
          </p>
        </div>
        <button
          onClick={() => setShowGuidelines(true)}
          className="px-5 py-2.5 border border-[#113254] text-[#113254] font-semibold text-[14px] rounded-xl hover:bg-[#113254] hover:text-white transition-all"
        >
          View Guidelines
        </button>
      </div>

      {/* Required Photos Section */}
      <div className="mb-8">
        <h3 className="text-[15px] font-semibold text-[#4B5563] mb-4">
          Photos <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {requiredPhotos.map((photo, i) => (
            <UploadCard key={i} label={photo.label} />
          ))}
        </div>
      </div>

      {/* Recommended Photos Section */}
      <div>
        <h3 className="text-[15px] font-semibold text-[#4B5563] mb-4">
          Photos (recommended – improves estimate accuracy)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedPhotos.map((photo, i) => (
            <UploadCard key={i} label={photo.label} />
          ))}
        </div>
      </div>

      {/* Guidelines Modal (Based on image_e09ab8.jpg) */}
      <Dialog open={showGuidelines} onOpenChange={setShowGuidelines}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl border-none">
          <div className="flex items-center justify-between px-8 py-6 border-b">
            <DialogTitle className="text-xl font-bold text-[#1A1A2E]">
              Photo Guidelines
            </DialogTitle>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
            {/* Example slots for the 6 photos shown in image_e09ab8.jpg */}
            {[1, 2, 3, 1, 2, 3].map((num, i) => (
              <div key={i} className="space-y-3">
                <div className="relative aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden">
                  <div className="absolute top-3 left-3 w-7 h-7 bg-white rounded-full flex items-center justify-center font-bold text-[#113254] text-xs shadow-sm">
                    {num}
                  </div>
                  {/* <img src="..." alt="guide" className="object-cover w-full h-full" /> */}
                </div>
                <p className="text-[#113254] font-bold text-[14px]">
                  {
                    [
                      "Front Smile",
                      "Wide Smile",
                      "Upper Arch",
                      "Lower Arch",
                      "Left Side",
                      "Right Side",
                    ][i]
                  }
                </p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function UploadCard({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#E5E7EB] rounded-2xl hover:border-[#113254] transition-colors cursor-pointer group min-h-[160px] text-center">
      <Upload className="w-6 h-6 text-[#9CA3AF] group-hover:text-[#113254] mb-3" />
      <span className="text-[14px] font-bold text-[#1A1A2E] leading-snug px-2">
        {label}
      </span>
    </div>
  );
}
