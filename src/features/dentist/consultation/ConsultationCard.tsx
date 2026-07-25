import React from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

// Parse a timezone string like "GMT+6 Time Zone (BST, GMT+6)" into offset minutes
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
  if (tzStr.includes("CST")) return -6 * 65;
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

const isWithinMeetingWindow = (consultation: any): boolean => {
  if (!consultation.scheduledDate || !consultation.scheduledTime) return false;

  const startUtcMs = getConsultationStartUtcMs(
    consultation.scheduledDate,
    consultation.scheduledTime,
    consultation.timezone
  );

  const durationMinutes = consultation.durationMinutes || 15;
  const now = Date.now();
  // 5 minutes early buffer, up to end of duration
  const startBuffer = startUtcMs - 5 * 60 * 1000;
  const end = startUtcMs + durationMinutes * 60 * 1000;

  return now >= startBuffer && now <= end;
};

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

  const isMeetingActive = isWithinMeetingWindow(data);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Header: Avatar & Info */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-full bg-[#113254]/5 flex items-center justify-center text-[#113254] font-bold text-sm shrink-0">
              {initials || "P"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1A1A2E] text-[17px] leading-snug truncate">
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
            className="p-2.5 bg-slate-50 hover:bg-slate-100 text-[#113254] rounded-full border border-slate-200 transition-colors shrink-0 cursor-pointer flex items-center justify-center"
          >
            <MessageSquare size={16} />
          </button>
        </div>

        <div className="border-t border-gray-100 my-4" />

        {type === "Treatment Estimate" && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-[#1A1A2E]">
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
            <div className="border-t border-gray-100 my-4" />
          </>
        )}

        {/* Details Grid */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Treatment Procedure</p>
              <p className="text-sm font-bold text-[#1A1A2E] truncate pr-2">{procedure}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Approx. Budget</p>
              <p className="text-sm font-bold text-[#1A1A2E]">{budget}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 my-4" />

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Date</p>
              <p className="text-sm font-bold text-[#1A1A2E]">{date}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Time slot</p>
              <p className="text-sm font-bold text-[#1A1A2E]">{timeSlot}</p>
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
            className="w-full h-11 border border-[#113254] text-[#113254] rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            View Details
          </button>
        ) : type === "Active" ? (
          <>
            {data.requestStatus === "MISSED" ? (
              <>
                <button
                  onClick={onClick}
                  className="flex-1 h-11 border border-[#113254] text-[#113254] rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={onAction}
                  className="flex-1 h-11 bg-[#113254] hover:bg-[#0d2844] text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
                >
                  Reschedule
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClick}
                  className={`h-11 border border-[#113254] text-[#113254] rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer ${isMeetingActive ? "flex-1" : "w-full"
                    }`}
                >
                  View Details
                </button>
                {isMeetingActive && (
                  <button
                    onClick={onJoinMeeting}
                    className="flex-1 h-11 bg-[#113254] hover:bg-[#0d2844] text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
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
              className="flex-1 h-11 border border-[#113254] text-[#113254] rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              View Details
            </button>
            {treatmentPlanStatus !== "Accepted" ? (
              <button
                onClick={onAction}
                className="flex-1 h-11 bg-[#113254] hover:bg-[#0d2844] text-white rounded-lg font-bold text-sm transition-colors cursor-pointer"
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
