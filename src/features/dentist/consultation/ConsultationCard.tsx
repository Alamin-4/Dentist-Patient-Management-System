import React from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface CardProps {
  data: any;
  type: string;
  onClick: () => void;
  isMeetingActive?: boolean;
  onJoinMeeting?: () => void;
  onMarkComplete?: () => void;
  onAction?: () => void;
}

export const ConsultationCard = ({
  data,
  type,
  onClick,
  isMeetingActive = false,
  onJoinMeeting,
  onMarkComplete,
  onAction,
}: CardProps) => {
  const router = useRouter();
  const patientName = `${data.intake?.firstName || ""} ${data.intake?.lastName || ""}`.trim();
  const email = data.intake?.email || "";
  const initials = `${data.intake?.firstName?.[0] || ""}${data.intake?.lastName?.[0] || ""}`.toUpperCase();
  const procedure = data.intake?.procedureNames?.[0] || "N/A";
  const budget = data.intake?.budget || "N/A";
  const date = data.scheduledDate ? new Date(data.scheduledDate).toLocaleDateString() : "Not Scheduled";
  const timeSlot = data.scheduledTime || "N/A";

  let treatmentPlanStatus = "Not Sent";
  if (data.treatmentPlan) {
    if (data.treatmentPlan.status === "PROPOSED") {
      treatmentPlanStatus = "Awaiting response";
    } else if (data.treatmentPlan.status === "CANCELLED") {
      treatmentPlanStatus = "Rejected";
    } else if (data.treatmentPlan.status === "ACTIVE" || data.treatmentPlan.status === "COMPLETED") {
      treatmentPlanStatus = "Accepted";
    }
  }

  return (
    <div className="bg-white border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header: Avatar & Info */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-brand-deep-navy/5 flex items-center justify-center text-brand-deep-navy font-bold text-sm shrink-0">
              {initials || "P"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-text text-[17px] leading-snug truncate">
                  {patientName || "Patient"}
                </h3>
                {data.requestStatus === "MISSED" && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100 uppercase tracking-wider shrink-0">
                    Missed
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium truncate">{email}</p>
            </div>
          </div>

          {/* Chat Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/dentist/messages?chatId=${data.id}`);
            }}
            title="Chat with Patient"
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-brand-deep-navy rounded-full border border-slate-200 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
          >
            <MessageSquare size={16} />
          </button>
        </div>

        <div className="border-t border-gray-100 my-4" />

        {type === "Treatment Estimate" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-text">
                Treatment Plan Status
              </span>
              <span
                className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${treatmentPlanStatus === "Not Sent"
                  ? "bg-slate-100 text-text-charcoal"
                  : treatmentPlanStatus === "Rejected"
                    ? "bg-red-50 text-red-500"
                    : treatmentPlanStatus === "Accepted"
                      ? "bg-emerald-50 text-emerald-500"
                      : "bg-orange-50 text-orange-500"
                  }`}
              >
                {treatmentPlanStatus}
              </span>
            </div>
            <div className="border-t border-gray-100 my-4" />
          </>
        )}

        {/* Details Grid */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Treatment Procedure</p>
              <p className="text-sm font-bold text-text truncate pr-2">{procedure}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Approx. Budget</p>
              <p className="text-sm font-bold text-text">{budget}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4" />

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Date</p>
              <p className="text-sm font-bold text-text">{date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Time slot</p>
              <p className="text-sm font-bold text-text">{timeSlot}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 my-4" />

      {/* Dynamic Buttons based on Tab */}
      <div className="flex gap-3">
        {type === "Upcoming" ? (
          <button
            onClick={onClick}
            className="w-full h-11 border border-brand-deep-navy text-brand-deep-navy rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            View Details
          </button>
        ) : type === "Active" ? (
          <>
            {data.requestStatus === "MISSED" ? (
              <>
                <button
                  onClick={onClick}
                  className="flex-1 h-11 border border-brand-deep-navy text-brand-deep-navy rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={onAction}
                  className="flex-1 h-11 bg-brand-deep-navy hover:bg-brand-deep-navy-hover text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
                >
                  Reschedule
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClick}
                  className={`h-11 border border-brand-deep-navy text-brand-deep-navy rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer ${isMeetingActive ? "flex-1" : "w-full"
                    }`}
                >
                  View Details
                </button>
                {isMeetingActive && (
                  <button
                    onClick={onJoinMeeting}
                    className="flex-1 h-11 bg-brand-deep-navy hover:bg-brand-deep-navy-hover text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
                  >
                    Join Consultation
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          /* Treatment Estimate */
          <>
            <button
              onClick={onClick}
              className="flex-1 h-11 border border-brand-deep-navy text-brand-deep-navy rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View Details
            </button>
            {treatmentPlanStatus !== "Accepted" ? (
              <button
                onClick={onAction}
                className="flex-1 h-11 bg-brand-deep-navy hover:bg-brand-deep-navy-hover text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
              >
                {treatmentPlanStatus === "Not Sent" ? "Create Treatment Plan" : "Update Treatment Plan"}
              </button>
            ) : (
              <div className="flex-1 h-11 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-sm flex items-center justify-center border border-emerald-200">
                Plan Accepted
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
