"use client";

import { X, MessageSquare } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRespondToConsultation } from "@/hooks/consultation/useConsultation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export const ConsultationDetailsSidebar = ({
  isOpen,
  onClose,
  data,
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
          toast.error(err?.response?.data?.message || "Failed to submit decision.");
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
          <h2 className="font-semibold text-[#6B7280]">Request Details</h2>
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
                <h3 className="text-xl font-bold text-[#111113]">
                  {patientName || "Patient"}
                </h3>
                <p className="text-sm font-medium text-[#1A1A2E]">
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
                      <p className="text-xs font-medium text-[#1A1A2E]">
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
                      <p className="text-xs font-medium text-[#1A1A2E]">X-Ray</p>
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
        ) : (
          <div className="p-6 border-t border-[#E5E7EB] flex gap-4">
            <button
              onClick={() => router.push(`/dentist/messages?chatId=${data.id}`)}
              className="flex-1 h-12 rounded-lg bg-[#0A2540] text-white font-bold text-sm hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="size-4" />
              Chat with Patient
            </button>
          </div>
        )}
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