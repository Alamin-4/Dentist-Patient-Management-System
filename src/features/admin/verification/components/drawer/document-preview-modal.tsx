"use client";

import { ZoomIn, Download, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  name: string;
}

export function DocumentPreviewModal({ isOpen, onClose, url, name }: DocumentPreviewModalProps) {
  const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(url) || url.includes("headshot") || url.includes("selfie");
  const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(url) || url.includes("video") || url.includes("walkthrough");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="px-5 py-4 border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-base font-bold text-[#1A1A2E] truncate pr-4">
            {name}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Download File"
            >
              <Download className="h-4 w-4" />
            </a>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-y-auto bg-gray-50 flex items-center justify-center p-6">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={name}
              className="max-h-[65vh] w-auto object-contain rounded-lg shadow-sm border border-gray-200"
            />
          ) : isVideo ? (
            <video
              src={url}
              controls
              className="max-h-[65vh] w-full rounded-lg shadow-sm"
            />
          ) : url.toLowerCase().endsWith(".pdf") || url.includes("pdf") ? (
            <iframe
              src={url}
              title={name}
              className="w-full h-[65vh] rounded-lg border border-gray-200 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-sm font-semibold text-gray-700 mb-1">
                No Preview Available
              </p>
              <p className="text-xs text-gray-400 mb-4">
                This file format cannot be previewed directly.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
              >
                Open in new tab <ZoomIn className="h-4 w-4" />
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
