"use client";
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadDocumentModal({
  isOpen,
  onClose,
}: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-175 w-full p-0 border-none rounded-lg overflow-hidden bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <DialogTitle className="text-[22px] font-bold text-[#1A1A2E]">
            Upload Document
          </DialogTitle>
        </div>

        {/* Body / Upload Area */}
        <div className="p-8">
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center w-full py-20 border-2 border-dashed rounded-lg cursor-pointer transition-all
              ${isDragging ? "border-[#113254] bg-[#F0F9FF]" : "border-[#D1D5DB] hover:border-[#113254] bg-white"}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.png,.dicom"
            />

            <Upload className="w-8 h-8 text-[#1A1A2E] mb-4" />
            <p className="text-[#1A1A2E] font-bold text-[18px]">
              Drop files here or Tab to uplaod
            </p>
            <p className="text-[#6B7280] text-[15px] mt-1 font-medium">
              JPG, PNG, DICOM accepted
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-14 py-3 border border-[#113254] text-[#113254] font-bold text-[16px] rounded-lg hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button className="px-10 py-3 bg-[#113254] text-white font-bold text-[16px] rounded-lg hover:bg-[#0d2844] transition-all shadow-md active:scale-95">
            Add Document
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
