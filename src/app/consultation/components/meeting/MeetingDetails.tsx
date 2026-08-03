import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Clock, AlertTriangle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsultationChat } from "./ConsultationChat";

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

interface MeetingDetailsProps {
    consultation: any;
    userId: string;
    onBack: () => void;
    onReschedule?: () => void;
}

export function MeetingDetails({ consultation, userId, onBack, onReschedule }: MeetingDetailsProps) {
    const router = useRouter();
    const [showChat, setShowChat] = useState(false);
    const dentist = consultation.dentist;
    const dentistName = dentist?.user
        ? `Dr. ${dentist.user.firstName ?? ""} ${dentist.user.lastName ?? ""}`.trim()
        : consultation.directoryEntry?.name
            ? `Dr. ${consultation.directoryEntry.name}`
            : "Your Dentist";

    const scheduledDateStr = consultation.scheduledDate
        ? new Date(consultation.scheduledDate).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
        })
        : "Not scheduled";

    const scheduledTime = consultation.scheduledTime || "N/A";
    const timezone = consultation.timezone || "UTC";
    const duration = consultation.durationMinutes || 15;
    const procedure = consultation.intake?.procedureNames?.[0] || "Dental Consultation";

    // Check if the full meeting window has already passed
    const isExpired = (() => {
        if (!consultation.scheduledDate || !consultation.scheduledTime) return false;
        const startUtcMs = getConsultationStartUtcMs(
            consultation.scheduledDate,
            consultation.scheduledTime,
            consultation.timezone
        );
        const endMs = startUtcMs + duration * 60 * 1000;
        return Date.now() > endMs;
    })();

    // ── Expired / Missed session ──────────────────────────────────────────────
    if (isExpired) {
        return (
            <div className="flex h-full w-full flex-1 flex-col items-center justify-center bg-[#F9FAFB] p-6">
                <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="text-center space-y-1">
                        <div className="mx-auto size-16 rounded-full bg-accent/5 flex items-center justify-center mb-4">
                            <Clock className="size-8 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold text-text">Consultation Expired</h2>
                        <p className="text-sm text-gray-500">This session's time window has passed.</p>
                    </div>

                    <div className="space-y-3 rounded-xl bg-[#F8FAFC] p-5 border border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Dentist</span>
                            <span className="text-text font-semibold">{dentistName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Was scheduled</span>
                            <span className="text-text font-semibold">{scheduledDateStr}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Time</span>
                            <span className="text-text font-semibold">{scheduledTime} ({timezone})</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-accent/5 border border-amber-200 px-4 py-3 text-xs text-accent/95 leading-relaxed">
                        <AlertTriangle className="size-4 shrink-0 mt-0.5 text-accent" />
                        <p>This consultation was not completed. You can reschedule it from your dashboard, or contact support if you need assistance.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {onReschedule && (
                            <Button onClick={onReschedule} className="w-full bg-[#113254] hover:bg-[#0d2844] text-white font-semibold py-2.5 rounded-xl transition-all">
                                Reschedule Consultation
                            </Button>
                        )}
                        <Button onClick={onBack} variant="ghost" className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-semibold py-2.5 rounded-xl transition-all">
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Upcoming session ──────────────────────────────────────────────────────
    const isPatient = consultation.patient?.userId === userId;
    const recipientName = isPatient
        ? (dentist?.user ? `Dr. ${dentist.user.firstName ?? ""} ${dentist.user.lastName ?? ""}`.trim() : consultation.directoryEntry?.name ? `Dr. ${consultation.directoryEntry.name}` : "Dentist")
        : (consultation.intake ? `${consultation.intake.firstName} ${consultation.intake.lastName}`.trim() : "Patient");

    const recipientAvatar = isPatient
        ? (dentist?.user?.image || undefined)
        : undefined;

    return (
        <div className="flex h-full w-full flex-1 items-center justify-center bg-[#F9FAFB] p-6 overflow-hidden">
            <div className="max-w-6xl w-full flex flex-col md:flex-row gap-6 items-center md:items-stretch justify-center">
                <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-lg space-y-6">
                    <div className="text-center space-y-1">
                        <div className="mx-auto size-16 rounded-full bg-[#113254]/5 flex items-center justify-center mb-4">
                            <Video className="size-8 text-[#113254]" />
                        </div>
                        <h2 className="text-2xl font-bold text-text">Upcoming Consultation</h2>
                        <p className="text-sm text-gray-500">Your video session details are below</p>
                    </div>

                    <div className="space-y-3 rounded-xl bg-[#F8FAFC] p-5 border border-gray-100">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Dentist</span>
                            <span className="text-text font-semibold">{dentistName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Procedure</span>
                            <span className="text-text font-semibold">{procedure}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Date</span>
                            <span className="text-text font-semibold">{scheduledDateStr}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Time</span>
                            <span className="text-text font-semibold">{scheduledTime} ({timezone})</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 font-medium">Duration</span>
                            <span className="text-text font-semibold">{duration} minutes</span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 leading-relaxed">
                        The <strong className="text-[#113254] font-bold">Join Consultation</strong> button will appear on your dashboard 5 minutes before the scheduled time.
                    </p>

                    <div className="flex flex-col gap-2">
                        <Button
                            onClick={() => router.push(isPatient ? `/patient/messages?chatId=${consultation.id}` : `/dentist/messages?chatId=${consultation.id}`)}
                            className="w-full bg-[#113254] hover:bg-[#0d2844] text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="size-4" />
                            Chat Now
                        </Button>
                        <Button onClick={onBack} variant="ghost" className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-semibold py-2.5 rounded-xl transition-all">
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}