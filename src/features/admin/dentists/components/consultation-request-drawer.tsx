"use client";

import { useEffect, useState } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type TreatmentPlan = {
  procedure_breakdown: Array<{ procedure: string; price: number | string }>;
  estimate_amount: number;
  additional_info: string;
} | null;

type RequestDetails = {
  traveling_dates: string;
  schedule: { date: string; slot: string };
  dental_history: { last_visited: string; existing_conditions: string[] };
  notes: string | null;
  media: Array<{ label: string; type: string }>;
};

type Consultation = {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_initials: string;
  patient_color: string;
  treatment_procedure: string;
  approx_budget: number;
  treatment_plan_status: string | null;
  request_details: RequestDetails;
  treatment_plan: TreatmentPlan;
};

interface ConsultationRequestDrawerProps {
  open: boolean;
  consultation: Consultation | null;
  onClose: () => void;
}

type DrawerTab = "patient_info" | "treatment_plan";

const PLAN_STATUS_BADGE: Record<string, string> = {
  "Not Sent": "text-gray-500 bg-gray-100",
  "Awaiting response": "text-amber-600 bg-amber-50",
  Rejected: "text-red-500 bg-red-50",
};

export function ConsultationRequestDrawer({
  open,
  consultation,
  onClose,
}: ConsultationRequestDrawerProps) {
  const [activeTab, setActiveTab] = useState<DrawerTab>("patient_info");

  useEffect(() => {
    if (open) setActiveTab("patient_info");
  }, [open, consultation?.id]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasTreatmentPlan = consultation?.treatment_plan != null;
  const title = hasTreatmentPlan ? "Treatment Plan" : "Request Details";

  if (!open || !consultation) return null;

  const { request_details, treatment_plan, treatment_plan_status } = consultation;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-base font-bold text-[#1A1A2E]">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs (only if has treatment plan) */}
        {hasTreatmentPlan && (
          <div className="flex border-b border-gray-100">
            {(["patient_info", "treatment_plan"] as DrawerTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 text-sm font-semibold transition-colors",
                  activeTab === tab
                    ? "border-b-2 border-[#1A1A2E] text-[#1A1A2E]"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab === "patient_info" ? "Patient Info" : "Treatment Plan"}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Patient info */}
          {(activeTab === "patient_info" || !hasTreatmentPlan) && (
            <div className="flex flex-col gap-4">
              {/* Patient card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: consultation.patient_color }}
                  >
                    {consultation.patient_initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">
                      {consultation.patient_name}
                    </p>
                    <p className="text-xs text-gray-400">{consultation.patient_email}</p>
                  </div>
                </div>
                {treatment_plan_status && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      PLAN_STATUS_BADGE[treatment_plan_status] ?? "bg-gray-100 text-gray-500"
                    )}
                  >
                    {treatment_plan_status}
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-400">Treatment Procedure</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {consultation.treatment_procedure}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Appox Budget</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    ${consultation.approx_budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Traveling Dates</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {request_details.traveling_dates}
                  </p>
                </div>
              </div>

              {/* Treatment plan status row */}
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2.5">
                <p className="text-sm font-semibold text-gray-700">Treatment Plan Status</p>
                <span className="text-sm text-gray-400">
                  {treatment_plan_status ?? "Not Sent"}
                </span>
              </div>

              {/* Schedule */}
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-gray-700">Schedule Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Date</p>
                    <p className="mt-0.5 text-sm text-gray-700">{request_details.schedule.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">Slot</p>
                    <p className="mt-0.5 text-sm text-gray-700">{request_details.schedule.slot}</p>
                  </div>
                </div>
              </div>

              {/* Dental history */}
              <div className="rounded-lg border border-gray-100 bg-white p-4">
                <p className="mb-3 text-sm font-bold text-gray-700">Dental History</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-400">Last Visited</p>
                    <p className="mt-0.5 text-sm text-gray-700">
                      {request_details.dental_history.last_visited}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400">
                      Any existing dental conditions?
                    </p>
                    <p className="mt-0.5 text-sm text-gray-700">
                      {request_details.dental_history.existing_conditions.length > 0
                        ? request_details.dental_history.existing_conditions.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 text-sm text-gray-400">
                  {request_details.notes ?? "No Any Notes"}
                </div>
              </div>

              {/* Media */}
              {request_details.media.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-bold text-gray-700">Media</p>
                  <div className="grid grid-cols-3 gap-2">
                    {request_details.media.map((m, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex h-24 items-center justify-center rounded-lg border border-gray-100 bg-gray-100">
                          <ImageIcon className="h-6 w-6 text-gray-300" />
                        </div>
                        <p className="text-center text-xs text-gray-400">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Treatment plan tab */}
          {activeTab === "treatment_plan" && hasTreatmentPlan && treatment_plan && (
            <div className="flex flex-col gap-4">
              {/* Patient mini-card */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: consultation.patient_color }}
                  >
                    {consultation.patient_initials}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#1A1A2E]">
                      {consultation.patient_name}
                    </p>
                    <p className="text-xs text-gray-400">{consultation.patient_email}</p>
                  </div>
                </div>
                {treatment_plan_status && (
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      PLAN_STATUS_BADGE[treatment_plan_status] ?? "bg-gray-100 text-gray-500"
                    )}
                  >
                    {treatment_plan_status}
                  </span>
                )}
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-400">Treatment Procedure</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {consultation.treatment_procedure}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Appox Budget</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    ${consultation.approx_budget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400">Traveling Dates</p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {request_details.traveling_dates}
                  </p>
                </div>
              </div>

              {/* Treatment plan status row */}
              <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2.5">
                <p className="text-sm font-semibold text-gray-700">Treatment Plan Status</p>
                <span className="text-sm text-gray-400">
                  {treatment_plan_status ?? "Not Sent"}
                </span>
              </div>

              {/* Procedure breakdown */}
              <div className="rounded-lg border border-gray-100 bg-white">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-700">Procedure breakdown</p>
                  <p className="text-sm font-semibold text-gray-400">Price</p>
                </div>
                {treatment_plan.procedure_breakdown.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-50 px-4 py-2.5 last:border-b-0"
                  >
                    <p className="text-sm text-gray-600">{row.procedure}</p>
                    <p className="text-sm text-gray-600">
                      {typeof row.price === "number"
                        ? `$${row.price.toLocaleString()}`
                        : row.price}
                    </p>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                  <p className="text-sm font-bold text-[#1A1A2E]">Estimate amount</p>
                  <p className="text-sm font-bold text-blue-600">
                    ${treatment_plan.estimate_amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Additional info */}
              <div>
                <p className="mb-1.5 text-sm font-semibold text-gray-700">
                  Any other information to share?
                </p>
                <div className="min-h-[80px] rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-400">
                  {treatment_plan.additional_info || "Care instructions, follow-up"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
