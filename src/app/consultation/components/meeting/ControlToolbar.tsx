import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlButton } from "./ControlButton";

interface ControlToolbarProps {
    micMuted: boolean;
    cameraOff: boolean;
    showChat: boolean;
    unreadCount?: number;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onToggleChat: () => void;
    onEndCall: () => void;
    isMicDisabled?: boolean;
    isCameraDisabled?: boolean;
}

export function ControlToolbar({
    micMuted,
    cameraOff,
    showChat,
    unreadCount = 0,
    onToggleMic,
    onToggleCamera,
    onToggleChat,
    onEndCall,
    isMicDisabled,
    isCameraDisabled,
}: ControlToolbarProps) {
    return (
        <div className="flex items-center gap-3 border border-slate-250/90 rounded-2xl p-2 bg-white/95 backdrop-blur-sm shadow-xl">
            <ControlButton
                isOff={micMuted}
                onClick={onToggleMic}
                onIcon={<Mic className="size-5" />}
                offIcon={<MicOff className="size-5" />}
                title={micMuted ? "Unmute Mic" : "Mute Mic"}
                disabled={isMicDisabled}
            />

            <ControlButton
                isOff={cameraOff}
                onClick={onToggleCamera}
                onIcon={<Video className="size-5" />}
                offIcon={<VideoOff className="size-5" />}
                title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
                disabled={isCameraDisabled}
            />

            <button
                type="button"
                onClick={onToggleChat}
                className={`size-12 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer active:scale-95 relative ${showChat
                    ? "border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100"
                    : "border-slate-100 bg-slate-50 text-slate-650 hover:bg-slate-100 text-slate-600"
                    }`}
                title={showChat ? "Hide Chat" : "Show Chat"}
            >
                <MessageSquare className="size-5" />
                {!showChat && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black h-5 min-w-5 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <Button
                type="button"
                onClick={onEndCall}
                className="bg-[#D33C3C] cursor-pointer hover:bg-[#B83232] active:bg-[#9B2828] text-white text-xs md:text-sm font-semibold px-6 h-12 rounded-xl transition-all shadow-[0_4px_12px_rgba(211,60,60,0.15)] active:scale-95 flex items-center gap-2 border-0"
            >
                <PhoneOff className="size-4" />
                End consultation
            </Button>
        </div>
    );
}