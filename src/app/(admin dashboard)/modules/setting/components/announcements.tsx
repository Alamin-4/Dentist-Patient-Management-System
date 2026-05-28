"use client";

import { useState } from "react";
import { Plus, Trash2, Info, Users, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import type { Announcement, AnnouncementAudience } from "@/lib/settings-data";
import { NewAnnouncementModal } from "./new-announcement-modal";

interface AnnouncementsProps {
  initialAnnouncements: Announcement[];
}

function generateId() {
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AudienceBadge({ audience }: { audience: AnnouncementAudience }) {
  if (audience === "all") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
        <Users className="h-3 w-3" /> All users
      </span>
    );
  }
  if (audience === "dentists") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning-100 px-2.5 py-0.5 text-xs font-medium text-warning-700">
        <Stethoscope className="h-3 w-3" /> Dentists
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-700">
      <Users className="h-3 w-3" /> Patients
    </span>
  );
}

function StatusBadge({ status }: { status: Announcement["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "live"
          ? "bg-success-50 text-success-700"
          : "bg-gray-100 text-gray-500"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "live" ? "bg-success-500" : "bg-gray-400"
        )}
      />
      {status === "live" ? "Live" : "Dismissed"}
    </span>
  );
}

export function Announcements({ initialAnnouncements }: AnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePublish = (data: { title: string; message: string; audience: AnnouncementAudience }) => {
    const newAnn: Announcement = {
      id: generateId(),
      ...data,
      status: "live",
      publishedAt: new Date().toISOString().split("T")[0],
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setModalOpen(false);
    toast.success("Announcement published.");
  };

  const handleDelete = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.success("Announcement removed.");
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-base font-bold text-[#1A1A2E]">Platform Announcements</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              Broadcast banner messages to patients, dentists, or everyone.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#1A1A2E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1A1A2E]/90 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            New announcement
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {announcements.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">
              No announcements yet. Create one to broadcast to users.
            </p>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-[#1A1A2E]">{ann.title}</p>
                    <AudienceBadge audience={ann.audience} />
                    <StatusBadge status={ann.status} />
                  </div>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-gray-300 hover:bg-destructive-50 hover:text-destructive-500 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {ann.message}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  Published {formatDate(ann.publishedAt)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer note */}
        <p className="flex items-start gap-1.5 border-t border-gray-100 pt-4 text-xs text-gray-400">
          <Info className="mt-px h-3.5 w-3.5 shrink-0" />
          Announcements appear as a dismissible banner on the user dashboard. Dismissed announcements remain in this list.
        </p>
      </div>

      <NewAnnouncementModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPublish={handlePublish}
      />
    </>
  );
}
