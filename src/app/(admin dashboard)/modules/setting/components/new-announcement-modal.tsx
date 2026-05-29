"use client";

import { useState } from "react";
import { X, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnnouncementAudience } from "@/lib/settings-data";

interface NewAnnouncementModalProps {
  open: boolean;
  onClose: () => void;
  onPublish: (data: { title: string; message: string; audience: AnnouncementAudience }) => void;
}

const AUDIENCE_OPTIONS: { value: AnnouncementAudience; label: string }[] = [
  { value: "all", label: "All users" },
  { value: "patients", label: "Patients only" },
  { value: "dentists", label: "Dentists only" },
];

export function NewAnnouncementModal({ open, onClose, onPublish }: NewAnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<AnnouncementAudience>("all");
  const [publishing, setPublishing] = useState(false);

  if (!open) return null;

  const canPublish = title.trim().length > 0 && message.trim().length > 0;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 500));
    onPublish({ title: title.trim(), message: message.trim(), audience });
    setPublishing(false);
    setTitle("");
    setMessage("");
    setAudience("all");
  };

  const handleClose = () => {
    setTitle("");
    setMessage("");
    setAudience("all");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-start gap-3 border-b border-gray-100 p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning-50">
              <Megaphone className="h-5 w-5 text-warning-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-[#1A1A2E]">New announcement</h3>
              <p className="text-sm text-gray-500">Broadcast a message to platform users</p>
            </div>
            <button
              onClick={handleClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-4 p-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">
                Title <span className="text-destructive-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Scheduled maintenance on May 15"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 w-full rounded-xl border border-gray-200 px-3.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] transition-colors"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1A1A2E]">
                Message <span className="text-destructive-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Write the announcement body. Keep it clear and concise."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] transition-colors"
              />
            </div>

            {/* Audience */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1A1A2E]">Send to</label>
              <div className="flex gap-2">
                {AUDIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAudience(opt.value)}
                    className={cn(
                      "flex-1 rounded-xl border py-2 text-sm font-medium transition-colors",
                      audience === opt.value
                        ? "border-[#1A1A2E] bg-[#1A1A2E] text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-4">
            <button
              onClick={handleClose}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={!canPublish || publishing}
              className={cn(
                "flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white transition-all active:scale-95",
                canPublish
                  ? "bg-[#1A1A2E] hover:bg-[#1A1A2E]/90 shadow-sm"
                  : "cursor-not-allowed bg-gray-300"
              )}
            >
              <Megaphone className="h-3.5 w-3.5" />
              {publishing ? "Publishing…" : "Publish now"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
