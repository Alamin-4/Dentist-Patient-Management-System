"use client";

import { useState, useEffect } from "react";
import {
  X, MapPin, ExternalLink, AlertOctagon, Calendar,
  FileText, RotateCcw, Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dentist } from "../anti-collusion";

interface InvestigationDrawerProps {
  dentist: Dentist | null;
  onClose: () => void;
  onArchive: (dentist: Dentist) => void;
  onReinstate: (dentist: Dentist) => void;
  onReactivate: (dentist: Dentist) => void;
  onSaveNotes: (dentist: Dentist, notes: string) => void;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  suspended: { label: "Suspended", className: "bg-red-100 text-red-600 border border-red-200" },
  warning: { label: "Warning", className: "bg-amber-100 text-amber-700 border border-amber-200" },
  clean: { label: "Clean", className: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  cleared: { label: "Cleared", className: "bg-teal-100 text-teal-700 border border-teal-200" },
  removed: { label: "Removed", className: "bg-gray-100 text-gray-500 border border-gray-200" },
};

const RESPONSE_STYLE: Record<string, string> = {
  accepted: "text-emerald-600",
  cancelled: "text-red-500",
  disputed: "text-amber-600",
};

export function InvestigationDrawer({
  dentist,
  onClose,
  onArchive,
  onReinstate,
  onReactivate,
  onSaveNotes,
}: InvestigationDrawerProps) {
  const [notes, setNotes] = useState("");
  const open = !!dentist;

  useEffect(() => {
    if (dentist) setNotes(dentist.investigation_notes ?? "");
  }, [dentist]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!dentist) return null;

  const status = STATUS_BADGE[dentist.status] ?? STATUS_BADGE.clean;
  const isSuspended = dentist.status === "suspended";
  const isRemoved = dentist.status === "removed";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-white text-sm"
              style={{ backgroundColor: dentist.avatar_color }}
            >
              {dentist.initials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-[#1A1A2E]">{dentist.name}</p>
                <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", status.className)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status.label}
                </span>
              </div>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {dentist.country}
                </span>
                <span>RDV Score: <strong className="text-[#1A1A2E]">{dentist.rdv_score}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Suspension banner */}
        {isSuspended && dentist.suspended_date && (
          <div className="shrink-0 flex items-center gap-4 border-b border-red-100 bg-red-50 px-5 py-3 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-red-600">
              <AlertOctagon className="h-3.5 w-3.5" />
              Suspended: {dentist.suspended_date}
            </span>
            {dentist.investigation_opened && (
              <span className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                Investigation opened: {dentist.investigation_opened}
              </span>
            )}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">
            {/* Flag history */}
            {dentist.flags.length > 0 && (
              <section>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Flag History
                </p>
                <div className="space-y-3">
                  {dentist.flags.map((flag) => (
                    <div
                      key={flag.flag_number}
                      className="rounded-lg border border-gray-100 bg-white overflow-hidden"
                    >
                      {/* Flag header */}
                      <div className="flex items-center gap-2 border-b border-gray-50 px-4 py-3">
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                          FLAG {flag.flag_number}
                        </span>
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-xs font-semibold",
                            flag.flag_status === "active"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          )}
                        >
                          {flag.flag_status.charAt(0).toUpperCase() + flag.flag_status.slice(1)}
                        </span>
                      </div>

                      {/* Flag metadata */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3 text-xs">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">Booking ID</p>
                          <p className="mt-0.5 font-semibold text-blue-600">{flag.booking_id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">Booking Date</p>
                          <p className="mt-0.5 font-medium text-[#1A1A2E]">{flag.booking_date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">Patient</p>
                          <p className="mt-0.5 font-medium text-[#1A1A2E]">{flag.patient}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-gray-400">Procedure</p>
                          <p className="mt-0.5 font-medium text-[#1A1A2E]">{flag.procedure}</p>
                        </div>
                      </div>

                      {/* Price card */}
                      <div className="mx-4 mb-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <p className="text-[10px] text-gray-400">Estimate Price</p>
                            <p className="mt-0.5 text-base font-bold text-[#1A1A2E]">
                              ${flag.estimate_price.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Final Price</p>
                            <p className="mt-0.5 text-base font-bold text-[#1A1A2E]">
                              ${flag.final_price.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Variance</p>
                            <span className="mt-0.5 inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                              +{flag.variance_percent}%
                            </span>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Patient response</p>
                            <p className={cn("mt-0.5 text-sm font-semibold capitalize", RESPONSE_STYLE[flag.patient_response] ?? "text-gray-600")}>
                              {flag.patient_response.charAt(0).toUpperCase() + flag.patient_response.slice(1)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Flag footer */}
                      <div className="flex items-center justify-between border-t border-gray-50 px-4 py-2.5 text-xs text-gray-400">
                        <span>
                          Flagged: {flag.flagged_date} · Expires: {flag.expires_date}
                        </span>
                        <a
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center gap-1 font-medium text-blue-600 hover:underline"
                        >
                          View full booking <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* No flags state */}
            {dentist.flags.length === 0 && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-8 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-400">No price variance flags on record.</p>
              </div>
            )}

            {/* Investigation Notes */}
            <section>
              <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Investigation Notes
              </p>
              <p className="mb-2 text-xs text-gray-400">
                Internal only — not visible to dentist or patient.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add investigation notes..."
                className="w-full resize-none rounded-lg border border-gray-200 p-3.5 text-sm text-[#1A1A2E] outline-none placeholder:text-gray-300 focus:border-[#1A1A2E] focus:ring-1 focus:ring-[#1A1A2E] transition-colors"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => onSaveNotes(dentist, notes)}
                  className="rounded-lg bg-[#1A1A2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1A1A2E]/90 transition-colors"
                >
                  Save notes
                </button>
              </div>
            </section>

            {/* Archived state */}
            {isRemoved && dentist.archived_date && (
              <section>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1A2E]">
                      <Archive className="h-4 w-4 text-gray-400" />
                      Dentist Archived
                    </div>
                    <span className="text-xs text-gray-400">{dentist.archived_date}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Active bookings are progressing normally. This dentist cannot accept new bookings.
                    Their profile is hidden from patient search.
                  </p>
                  <button
                    onClick={() => onReactivate(dentist)}
                    className="mt-3 flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reactivate Dentist
                  </button>
                </div>
              </section>
            )}

            {/* Investigation decision (Suspended only) */}
            {isSuspended && (
              <section>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="mb-1 text-sm font-semibold text-[#1A1A2E]">Investigation Decision</p>
                  <p className="mb-3 text-xs text-gray-400">
                    This action cannot be undone. Review all evidence before proceeding.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => onReinstate(dentist)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#1A1A2E] hover:bg-gray-50 transition-colors"
                    >
                      Reinstate Dentist
                    </button>
                    <button
                      onClick={() => onArchive(dentist)}
                      className="flex-1 rounded-lg border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Archive Dentist
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
