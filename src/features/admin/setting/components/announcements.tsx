"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Info, Users, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { NewAnnouncementModal, type AnnouncementAudience } from "./new-announcement-modal";

export type AnnouncementStatus = "live" | "dismissed";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  audience: AnnouncementAudience;
  status: AnnouncementStatus;
  publishedAt: string;
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    title: "Scheduled maintenance — May 10",
    message:
      "RatedDocs will be unavailable for approximately 2 hours on Saturday May 10 between 02:00–04:00 UTC for routine maintenance.",
    audience: "all",
    status: "live",
    publishedAt: "2026-05-06",
  },
  {
    id: "ann-2",
    title: "New: Release code system now live",
    message:
      "We have launched the new release code flow for escrow payments. Patients will now receive a unique code upon accepting the final treatment plan.",
    audience: "dentists",
    status: "dismissed",
    publishedAt: "2026-04-30",
  },
];

function generateId() {
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AudienceBadge({ audience }: { audience: AnnouncementAudience }) {
  if (audience === "all") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
        <Users className="h-3 w-3" /> All users
      </span>
    );
  }
  if (audience === "dentists") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
        <Stethoscope className="h-3 w-3" /> Dentists
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 border border-sky-200">
      <Users className="h-3 w-3" /> Patients
    </span>
  );
}

function StatusBadge({ status }: { status: Announcement["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        status === "live"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-slate-100 text-slate-500 border-slate-200"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "live" ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {status === "live" ? "Live" : "Dismissed"}
    </span>
  );
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rateddocs_announcements");
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (e) {
        setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      }
    } else {
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      localStorage.setItem("rateddocs_announcements", JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    }
  }, []);

  const handlePublish = (data: { title: string; message: string; audience: AnnouncementAudience }) => {
    const newAnn: Announcement = {
      id: generateId(),
      ...data,
      status: "live",
      publishedAt: new Date().toISOString().split("T")[0],
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem("rateddocs_announcements", JSON.stringify(updated));
    setModalOpen(false);
    toast.success("Announcement published.");
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    localStorage.setItem("rateddocs_announcements", JSON.stringify(updated));
    toast.success("Announcement removed.");
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-text">Platform Announcements</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Broadcast banner messages to patients, dentists, or everyone.
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-admin-primary hover:bg-admin-primary/90 px-4 py-2 text-xs font-bold text-white active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New announcement
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {announcements.length === 0 ? (
            <p className="py-10 text-center text-xs text-slate-400">
              No announcements yet. Create one to broadcast to users.
            </p>
          ) : (
            announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs font-bold text-text">{ann.title}</p>
                    <AudienceBadge audience={ann.audience} />
                    <StatusBadge status={ann.status} />
                  </div>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ann.message}
                </p>
                <p className="mt-2 text-[10px] text-slate-400">
                  Published {formatDate(ann.publishedAt)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer note */}
        <p className="flex items-start gap-1.5 border-t border-slate-200 pt-4 text-xs text-slate-400">
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
