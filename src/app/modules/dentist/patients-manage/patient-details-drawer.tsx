"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { PatientCardItem } from "./patient-card";

type ActiveTab = "patient-info" | "treatment-plan";

const TREATMENT_ITEMS = [
  { label: "Initial examination", price: "Included" },
  { label: "CBCT scan (if needed)", price: "$693" },
  { label: "Temporary prosthesis", price: "$1,039" },
  { label: "Temporary prosthesis", price: "$1,200" },
  { label: "Final fitting & adjustments", price: "$346" },
];

const ESTIMATE_TOTAL = "$1,075";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function statusBadgeClass(status: PatientCardItem["treatmentPlan"]) {
  if (status === "Rejected") return "border-rose-300 bg-rose-50 text-rose-600";
  if (status === "Not Sent")
    return "border-slate-300 bg-slate-50 text-slate-600";
  return "border-amber-300 bg-amber-50 text-amber-600";
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {title && (
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
      )}
      {children}
    </div>
  );
}

function InfoField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`px-4 py-4 ${className}`}>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

interface PatientDetailsDrawerProps {
  patient: PatientCardItem | null;
  onClose: () => void;
}

export default function PatientDetailsDrawer({
  patient,
  onClose,
}: PatientDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("patient-info");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const tabs: Array<{ id: ActiveTab; label: string }> = [
    { id: "patient-info", label: "Patient Info" },
    { id: "treatment-plan", label: "Treatment Plan" },
  ];

  return (
    <Sheet
      open={Boolean(patient)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setActiveTab("patient-info");
        }
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full max-h-[calc(100vh-2rem)] my-auto rounded-2xl overflow-hidden flex-col gap-0 border-l border-border bg-card p-0 mx-6 sm:max-w-md data-[side=right]:w-full data-[side=right]:sm:max-w-md"
      >
        <header className="shrink-0 border-b border-border bg-card px-5 pt-5 pb-0">
          {/* Title row */}
          <div className="mb-4 flex items-center justify-between">
            <SheetTitle className="text-sm font-medium text-muted-foreground">
              Treatment Plan
            </SheetTitle>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative mr-6 pb-3 text-sm transition-colors px-4 ${
                    isActive
                      ? "font-semibold text-primary"
                      : "font-medium text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute -bottom-px left-0 right-0 h-1 rounded-t-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {patient && (
            <>
              <div className="border-b border-border px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                      {getInitials(patient.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-lg font-bold leading-tight text-foreground">
                        {patient.name}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {patient.email}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`mt-0.5 shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass(
                      patient.treatmentPlan,
                    )}`}
                  >
                    {patient.treatmentPlan}
                  </span>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-3 divide-x divide-border">
                  <div className="pr-3">
                    <p className="text-xs text-muted-foreground">
                      Treatment Procedure
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      Dental Implants
                    </p>
                  </div>
                  <div className="px-3">
                    <p className="text-xs text-muted-foreground">
                      Appox Budget
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {patient.approxBudget}
                    </p>
                  </div>
                  <div className="pl-3">
                    <p className="text-xs text-muted-foreground">
                      Traveling Dates
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">
                      {patient.travelingDates}
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Patient Info tab ── */}
              {activeTab === "patient-info" && (
                <div className="space-y-3 p-4">
                  {/* Schedule Details */}
                  <InfoCard title="Schedule Details">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <InfoField label="Date" value={patient.schedule.date} />
                      <InfoField label="Slot" value={patient.schedule.slot} />
                    </div>
                  </InfoCard>

                  {/* Dental History */}
                  <InfoCard title="Dental History">
                    <div className="grid grid-cols-2 divide-x divide-border border-b border-border">
                      <InfoField
                        label="Last Visited"
                        value={patient.dentalHistory.lastVisited}
                      />
                      <InfoField
                        label="Any existing dental conditions?"
                        value={patient.dentalHistory.conditions}
                      />
                    </div>
                    <div className="bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground">
                      No Any Notes
                    </div>
                  </InfoCard>

                  {/* Media */}
                  <InfoCard title="Media">
                    <div className="grid grid-cols-3 gap-3 p-4">
                      {patient.media.map((item) => (
                        <figure key={item.id} className="space-y-1.5">
                          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                            <Image
                              src={item.imageSrc}
                              alt={item.label}
                              fill
                              sizes="(max-width: 480px) 30vw, 140px"
                              className={`object-cover ${
                                item.label === "X-Ray" ? "grayscale" : ""
                              }`}
                            />
                          </div>
                          <figcaption className="text-xs text-muted-foreground">
                            {item.label}
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </InfoCard>
                </div>
              )}

              {/* ── Treatment Plan tab ── */}
              {activeTab === "treatment-plan" && (
                <div className="space-y-4 p-4">
                  {/* Procedure breakdown */}
                  <InfoCard title="">
                    {/* Header row */}
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                      <p className="text-sm font-semibold text-foreground">
                        Procedure breakdown
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        Price
                      </p>
                    </div>

                    {/* Line items */}
                    {TREATMENT_ITEMS.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-border px-4 py-3 last:border-b-0"
                      >
                        <p className="text-sm text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.price}
                        </p>
                      </div>
                    ))}

                    {/* Estimate total */}
                    <div className="flex items-center justify-between border-t border-border px-4 py-3">
                      <p className="text-sm font-semibold text-sidebar">
                        Estimate amount
                      </p>
                      <p className="text-sm font-bold text-sidebar">
                        {ESTIMATE_TOTAL}
                      </p>
                    </div>
                  </InfoCard>

                  {/* Additional notes */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Any other information to share?
                    </p>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Care instructions, follow-up"
                      rows={4}
                      className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
