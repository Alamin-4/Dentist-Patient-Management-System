"use client";
import { UploadCloud } from "lucide-react";

export function HeadshotUpload() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900">Professional Headshot</h3>
      <div className="group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-10 transition-all hover:border-[#163E5C] hover:bg-white">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
          <UploadCloud className="h-6 w-6 text-[#163E5C]" />
        </div>
        <p className="text-sm font-semibold text-gray-900">
          Click to upload or drag and drop
        </p>
        <p className="mt-1 text-xs text-gray-400 font-medium">
          High-resolution JPG or PNG, minimal background
        </p>
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
