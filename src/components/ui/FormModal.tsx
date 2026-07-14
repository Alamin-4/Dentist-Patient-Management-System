import React from "react";
import { X } from "lucide-react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  submitText: string;
  isSubmitting?: boolean;
  children: React.ReactNode;
}

export function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitText,
  isSubmitting = false,
  children,
}: FormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-md rounded-lg border border-gray-100 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-lg font-semibold text-[#1A1A2E]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-4">
          {children}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="inline-flex h-10 items-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center rounded-lg bg-[#1A1A2E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#2A2A3E] disabled:opacity-50"
            >
              {isSubmitting ? `${submitText}...` : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
