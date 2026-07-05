interface SessionHeaderProps {
    otherParticipantName: string;
    timeLeft: number;
    isLowTime: boolean;
}

export function SessionHeader({ otherParticipantName, timeLeft, isLowTime }: SessionHeaderProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex-none flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="space-y-1">
                <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
                    Live Consultation
                </h1>
                <p className="text-xs text-slate-400">
                    Secure video call with {otherParticipantName}
                </p>
            </div>

            <div className="text-right">
                <p className={`text-xl md:text-2xl font-mono font-bold tracking-tight tabular-nums ${isLowTime ? "text-rose-500 animate-pulse" : "text-emerald-400"
                    }`}>
                    {formatTime(timeLeft)}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-widest mt-0.5">
                    Time Remaining
                </p>
            </div>
        </div>
    );
}