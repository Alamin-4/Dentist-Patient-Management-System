import React from "react";

interface CardProps {
  data: any;
  type: string;
  onClick: () => void;
  onJoinMeeting?: () => void;
  onMarkComplete?: () => void;
  onAction?: () => void;
}

export const ConsultationCard = ({
  data,
  type,
  onClick,
  onJoinMeeting,
  onMarkComplete,
  onAction,
}: CardProps) => {
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
    <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header: Avatar & Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#163E5C] font-bold text-sm">
            {initials || "P"}
          </div>
          <div>
            <h3 className="font-bold text-[#111113] text-lg">
              {patientName || "Patient"}
            </h3>
            <p className="text-sm text-slate-500 font-medium truncate max-w-[180px]">{email}</p>
          </div>
        </div>

        <hr className="border-slate-50 mb-4" />

        {type === "Treatment Estimate" && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-[#111113]">
              Treatment Plan Status
            </span>
            <span
              className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${treatmentPlanStatus === "Not Sent"
                ? "bg-slate-100 text-[#777779]"
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
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-6 mb-8">
          <div>
            <p className="text-xs text-[#777779] mb-1">Treatment Procedure</p>
            <p className="text-sm font-bold text-[#111113] truncate pr-2">{procedure}</p>
          </div>
          <div>
            <p className="text-xs text-[#777779] mb-1">Approx Budget</p>
            <p className="text-sm font-bold text-[#111113]">{budget}</p>
          </div>
          <div>
            <p className="text-xs text-[#777779] mb-1">Date</p>
            <p className="text-sm font-bold text-[#111113]">{date}</p>
          </div>
          <div>
            <p className="text-xs text-[#777779] mb-1">Time slot</p>
            <p className="text-sm font-bold text-[#111113]">{timeSlot}</p>
          </div>
        </div>
      </div>

      {/* Dynamic Buttons based on Tab */}
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={onClick}
          className="flex-1 h-11 border border-[#163E5C] text-[#163E5C] rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
        >
          View Details
        </button>

        {["SCHEDULED", "ACTIVE", "COMPLETED"].includes(data.requestStatus) && (
          <div className="flex gap-2 flex-1">
            <button
              onClick={onJoinMeeting}
              className="flex-1 h-11 bg-[#0A2540] text-white rounded-lg font-bold text-sm hover:opacity-90 cursor-pointer"
            >
              Join
            </button>
            <button
              onClick={onMarkComplete}
              className="flex-1 h-11 bg-[#10B981] text-white rounded-lg font-bold text-sm hover:opacity-90 cursor-pointer"
            >
              Complete
            </button>
          </div>
        )}

        {type === "Treatment Estimate" && treatmentPlanStatus !== "Accepted" && (
          <button
            onClick={onAction}
            className="flex-1 h-11 bg-[#0A2540] text-white rounded-lg font-bold text-sm hover:opacity-90 cursor-pointer"
          >
            {treatmentPlanStatus === "Not Sent" ? "Create Plan" : "Update Plan"}
          </button>
        )}
      </div>
    </div>
  );
};
