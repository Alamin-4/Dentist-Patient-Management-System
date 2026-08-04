"use client";

import { X, MessageSquare } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRespondToConsultation } from "@/hooks/consultation/useConsultation";

const parseTimezoneOffsetMinutes = (tzStr?: string | null): number => {
  if (!tzStr) return 0;
  const regex = /(?:UTC|GMT)\s*([+-])\s*(\d+)(?::(\d+))?/;
  const match = tzStr.match(regex);
  if (match) {
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + minutes);
  }
  if (tzStr.includes("EST")) return -5 * 60;
  if (tzStr.includes("CST")) return -6 * 60;
  if (tzStr.includes("MST")) return -7 * 60;
  if (tzStr.includes("PST")) return -8 * 60;
  if (tzStr.includes("CET")) return 1 * 60;
  if (tzStr.includes("AEST")) return 10 * 60;
  if (tzStr.includes("BST")) return 6 * 60;
  return 0;
};

const getConsultationStartUtcMs = (scheduledDate: string | Date, scheduledTime: string, timezoneStr?: string | null): number => {
  const dObj = new Date(scheduledDate);
  const year = dObj.getUTCFullYear();
  const month = dObj.getUTCMonth();
  const day = dObj.getUTCDate();

  const timeParts = scheduledTime.split(":");
  let hours = parseInt(timeParts[0], 10);
  let minutes = timeParts[1] ? parseInt(timeParts[1], 10) : 0;

  if (scheduledTime.toUpperCase().includes("PM") && hours < 12) {
    hours += 12;
  } else if (scheduledTime.toUpperCase().includes("AM") && hours === 12) {
    hours = 0;
  }

  if (isNaN(hours)) hours = 0;
  if (isNaN(minutes)) minutes = 0;

  const localUtcMs = Date.UTC(year, month, day, hours, minutes, 0, 0);
  const offsetMinutes = parseTimezoneOffsetMinutes(timezoneStr);
  return localUtcMs - offsetMinutes * 60 * 1000;
};

const isPast = (consultation: any): boolean => {
  if (!consultation.scheduledDate || !consultation.scheduledTime) return false;
  const startUtcMs = getConsultationStartUtcMs(
    consultation.scheduledDate,
    consultation.scheduledTime,
    consultation.timezone
  );
  const durationMinutes = consultation.durationMinutes || 15;
  return Date.now() > startUtcMs + durationMinutes * 60 * 1000;
};

const isMissed = (consultation: any): boolean => {
  if (consultation.requestStatus === "MISSED") return true;
  return (
    (consultation.requestStatus === "SCHEDULED" || consultation.requestStatus === "ACTIVE") &&
    isPast(consultation)
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onCreateTreatmentPlan?: () => void;
}

export const ConsultationDetailsSidebar = ({
  isOpen,
  onClose,
  data,
  onCreateTreatmentPlan,
}: SidebarProps) => {
  const router = useRouter();
  const respondMutation = useRespondToConsultation();

  if (!isOpen || !data) return null;

  const handleRespond = (action: "ACCEPT" | "REJECT") => {
    respondMutation.mutate(
      {
        id: data.id,
        payload: { action },
      },
      {
        onSuccess: () => {
          toast.success(`Consultation request has been ${action === "ACCEPT" ? "accepted" : "rejected"} successfully.`);
          onClose();
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to submit decision.");
        },
      }
    );
  };

  const patientName = `${data.intake?.firstName || ""} ${data.intake?.lastName || ""}`.trim();
  const initials = `${data.intake?.firstName?.[0] || ""}${data.intake?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className="fixed right-4 top-4 bottom-4 w-full max-w-120 bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex justify-between items-center">
          <h2 className="font-semibold text-sec-text">Request Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} className="text-[#777779]" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Patient Profile Section */}
          <div className="space-y-6 bg-[#F8FAFC] px-6 py-4 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-4 ">
              <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#163E5C] font-bold text-lg">
                {initials || "P"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-[#111113]">
                    {patientName || "Patient"}
                  </h3>
                  {isMissed(data) && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-wider shrink-0">
                      Missed
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-text">
                  {data.intake?.email}
                </p>
              </div>
            </div>
            <div className="border-b border-[#E5E7EB]"></div>
            <div className="grid grid-cols-3 gap-4 items-center justify-center">
              <DetailItem label="Treatment Procedure" value={data.intake?.procedureNames?.[0] || "N/A"} />
              <DetailItem label="Appox Budget" value={data.intake?.budget || "N/A"} />
              <DetailItem
                label="Traveling Dates"
                value={
                  data.intake?.travelFrom
                    ? `${new Date(data.intake.travelFrom).toLocaleDateString()} - ${data.intake.travelTo ? new Date(data.intake.travelTo).toLocaleDateString() : ""}`
                    : "N/A"
                }
              />
            </div>
          </div>

          <div className="px-4 py-4 space-y-4">
            {/* Schedule Details Card */}
            <SectionCard title="Schedule Details ">
              <div className="grid grid-cols-2">
                <div className="p-4 border-r border-[#E5E7EB]">
                  <p className="text-xs text-[#777779]  mb-1">Date</p>
                  <p className="text-sm font-bold text-[#111113]">
                    {data.scheduledDate ? new Date(data.scheduledDate).toLocaleDateString() : "Not Scheduled"}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#777779]  mb-1">Slot</p>
                  <p className="text-sm font-bold text-[#111113]">
                    {data.scheduledTime || "N/A"}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Dental History Card */}
            <SectionCard title="Dental History">
              <div className="grid grid-cols-2 border-b border-[#E5E7EB]">
                <div className="p-4 border-r border-[#E5E7EB]">
                  <p className="text-xs text-[#777779]  mb-1">Last Visited</p>
                  <p className="text-sm font-bold text-[#111113]">
                    {data.intake?.lastVisit || "N/A"}
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#777779]  mb-1">
                    Any existing dental conditions?
                  </p>
                  <p className="text-sm text-[#111113]">
                    <span className="font-semibold text-[#111113]">
                      {data.intake?.conditions?.join(", ") || "None"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50">
                <p className="text-xs font-bold text-[#777779] mb-1">Additional Notes</p>
                <p className="text-sm text-slate-600">{data.intake?.additionalInfo || "No additional notes provided"}</p>
              </div>
            </SectionCard>

            {/* Media Section */}
            {((data.intake?.photos && data.intake.photos.length > 0) || data.intake?.xrayUrl) && (
              <div className=" border border-[#E5E7EB] rounded-lg space-y-4">
                <h4 className="text-sm font-bold text-[#4A4A4C] pt-4 pl-4">
                  Media
                </h4>
                <div className="p-4 grid grid-cols-3 gap-3 border-y border-[#E5E7EB]">
                  {data.intake.photos?.map((photo: string, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-4/3 rounded-lg bg-slate-200 overflow-hidden">
                        <img
                          src={photo}
                          alt={`Intake Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-text">
                        Intake Photo {index + 1}
                      </p>
                    </div>
                  ))}
                  {data.intake.xrayUrl && (
                    <div className="space-y-2">
                      <div className="aspect-4/3 rounded-lg bg-slate-200 overflow-hidden">
                        <img
                          src={data.intake.xrayUrl}
                          alt="X-Ray"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-medium text-text">X-Ray</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons: only show Accept/Reject if consultation status is PENDING */}
        {data.requestStatus === "PENDING" ? (
          <div className="p-6 border-t border-[#E5E7EB] flex gap-4">
            <button
              onClick={() => handleRespond("REJECT")}
              disabled={respondMutation.isPending}
              className="flex-1 h-12 rounded-lg border border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {respondMutation.isPending ? "Processing..." : "Reject"}
            </button>
            <button
              onClick={() => handleRespond("ACCEPT")}
              disabled={respondMutation.isPending}
              className="flex-1 h-12 rounded-lg border border-emerald-200 text-emerald-500 font-bold text-sm hover:bg-emerald-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {respondMutation.isPending ? "Processing..." : "Accept"}
            </button>
          </div>
        ) : data.requestStatus === "COMPLETED" && data.treatmentPlan?.status !== "ACTIVE" && data.treatmentPlan?.status !== "COMPLETED" && onCreateTreatmentPlan ? (
          <div className="p-6 border-t border-[#E5E7EB] flex gap-4">
            <button
              onClick={onCreateTreatmentPlan}
              className="flex-1 h-12 rounded-lg bg-[#113254] hover:bg-[#0d2844] text-white font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {data.treatmentPlan ? "Update Treatment Plan" : "Create Treatment Plan"}
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-[#777779]">{label}</p>
    <p className="text-sm font-bold text-[#111113]">{value}</p>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b border-[#E5E7EB]">
      <h4 className="text-sm font-bold text-[#4A4A4C]">{title}</h4>
    </div>
    {children}
  </div>
);