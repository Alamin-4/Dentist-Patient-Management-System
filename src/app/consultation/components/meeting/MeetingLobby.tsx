import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MeetingLobbyProps {
    lobbySecondsLeft: number;
    consultation: any;
    onLeave: () => void;
}

export function MeetingLobby({ lobbySecondsLeft, consultation, onLeave }: MeetingLobbyProps) {
    const mins = Math.floor(lobbySecondsLeft / 60);
    const secs = lobbySecondsLeft % 60;
    const countdownStr = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    const scheduledTime = consultation.scheduledTime || "";
    const timezone = consultation.timezone || "";

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#0B0F19] p-4 text-white">
            <div className="max-w-sm w-full rounded-2xl border border-blue-500/20 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md text-center space-y-6">
                <div className="relative mx-auto size-32 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-blue-500/10 animate-pulse" />
                    <span className="relative text-3xl font-black text-blue-400 tabular-nums tracking-tight">
                        {countdownStr}
                    </span>
                </div>

                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-100">Meeting Lobby</h2>
                    <p className="text-sm text-slate-400">
                        Your session starts at <span className="text-white font-semibold">{scheduledTime} {timezone}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                        You will be connected automatically when the meeting begins.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-emerald-400">
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    Waiting for meeting to start...
                </div>

                <Button variant="ghost" onClick={onLeave} className="w-full text-slate-400 hover:text-white text-sm">
                    ← Leave Lobby
                </Button>
            </div>
        </div>
    );
}