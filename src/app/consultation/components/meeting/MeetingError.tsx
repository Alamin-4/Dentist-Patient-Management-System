import { AlertCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingErrorProps {
    error: string | null;
    onBack: () => void;
}

export function MeetingError({ error, onBack }: MeetingErrorProps) {
    const isTooEarly = error?.includes("You can join up to 5 minutes early") || error?.includes("is scheduled for");

    return (
        <div className="flex h-full w-full flex-1 items-center justify-center bg-[#0B0F19] p-4 text-white">
            <div className={`max-w-md w-full rounded-2xl border p-6 text-center shadow-2xl backdrop-blur-md ${isTooEarly ? "border-amber-500/20 bg-slate-900/60" : "border-red-500/20 bg-slate-900/60"
                }`}>
                <div className={`mx-auto flex size-14 items-center justify-center rounded-full mb-4 ${isTooEarly ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-500"
                    }`}>
                    {isTooEarly ? <Video className="size-7" /> : <AlertCircle className="size-7" />}
                </div>
                <h2 className="text-xl font-bold text-slate-100">
                    {isTooEarly ? "Meeting Not Started Yet" : "Unable to Join Call"}
                </h2>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    {isTooEarly
                        ? "This meeting hasn't opened yet. You can join up to 5 minutes before the scheduled time. Please check your dashboard for the exact time."
                        : (error || "We encountered an issue preparing the video consultation.")}
                </p>
                {isTooEarly && (
                    <p className="mt-2 text-xs text-amber-400/70 font-mono break-all">
                        {error}
                    </p>
                )}
                <Button onClick={onBack} className="mt-6 w-full bg-[#113254] hover:bg-[#0d2844] text-white font-semibold py-2.5 rounded-xl transition-all">
                    ← Back to Dashboard
                </Button>
            </div>
        </div>
    );
}