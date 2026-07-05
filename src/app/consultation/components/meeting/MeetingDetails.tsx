import { Video, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingDetailsProps {
    consultation: any;
    onBack: () => void;
    onReschedule?: () => void;
}

export function MeetingDetails({ consultation, onBack, onReschedule }: MeetingDetailsProps) {
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
        if (!consultation.scheduledDate) return false;
        const endMs = new Date(consultation.scheduledDate).getTime() + duration * 60 * 1000;
        return Date.now() > endMs;
    })();

    // ── Expired / Missed session ──────────────────────────────────────────────
    if (isExpired) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B0F19] p-4 text-white">
                <div className="max-w-md w-full rounded-2xl border border-amber-500/20 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md space-y-6">
                    <div className="text-center space-y-1">
                        <div className="mx-auto size-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                            <Clock className="size-8 text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-100">Consultation Expired</h2>
                        <p className="text-sm text-slate-400">This session's time window has passed.</p>
                    </div>

                    <div className="space-y-3 rounded-xl bg-slate-800/60 p-5 border border-slate-700/50">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Dentist</span>
                            <span className="text-slate-100 font-semibold">{dentistName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Was scheduled</span>
                            <span className="text-slate-100 font-semibold">{scheduledDateStr}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400 font-medium">Time</span>
                            <span className="text-slate-100 font-semibold">{scheduledTime} ({timezone})</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-amber-500/5 border border-amber-500/20 px-4 py-3 text-xs text-amber-300 leading-relaxed">
                        <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                        <p>This consultation was not completed. You can reschedule it from your dashboard, or contact support if you need assistance.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        {onReschedule && (
                            <Button onClick={onReschedule} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-xl transition-all">
                                Reschedule Consultation
                            </Button>
                        )}
                        <Button onClick={onBack} variant="ghost" className="w-full text-slate-400 hover:text-white font-semibold py-2.5 rounded-xl transition-all">
                            ← Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Upcoming session ──────────────────────────────────────────────────────
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B0F19] p-4 text-white">
            <div className="max-w-md w-full rounded-2xl border border-blue-500/20 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md space-y-6">
                <div className="text-center space-y-1">
                    <div className="mx-auto size-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                        <Video className="size-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">Upcoming Consultation</h2>
                    <p className="text-sm text-slate-400">Your video session details are below</p>
                </div>

                <div className="space-y-3 rounded-xl bg-slate-800/60 p-5 border border-slate-700/50">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Dentist</span>
                        <span className="text-slate-100 font-semibold">{dentistName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Procedure</span>
                        <span className="text-slate-100 font-semibold">{procedure}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Date</span>
                        <span className="text-slate-100 font-semibold">{scheduledDateStr}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Time</span>
                        <span className="text-slate-100 font-semibold">{scheduledTime} ({timezone})</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">Duration</span>
                        <span className="text-slate-100 font-semibold">{duration} minutes</span>
                    </div>
                </div>

                <p className="text-center text-xs text-slate-500 leading-relaxed">
                    The <strong className="text-blue-400">Join Consultation</strong> button will appear on your dashboard 5 minutes before the scheduled time.
                </p>

                <Button onClick={onBack} className="w-full bg-[#113254] hover:bg-[#0d2844] text-white font-semibold py-2.5 rounded-xl transition-all">
                    ← Back to Dashboard
                </Button>
            </div>
        </div>
    );
}