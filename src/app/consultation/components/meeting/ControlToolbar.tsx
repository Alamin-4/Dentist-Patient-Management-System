import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlButton } from "./ControlButton";

interface ControlToolbarProps {
    micMuted: boolean;
    cameraOff: boolean;
    showChat: boolean;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onToggleChat: () => void;
    onEndCall: () => void;
}

export function ControlToolbar({
    micMuted,
    cameraOff,
    showChat,
    onToggleMic,
    onToggleCamera,
    onToggleChat,
    onEndCall,
}: ControlToolbarProps) {
    return (
        <div className="flex-none flex items-center justify-center rounded-2xl border border-slate-800/80 bg-[#0E1322]/80 backdrop-blur-md p-4 shadow-xl mt-4">
            <div className="flex items-center gap-4">
                <ControlButton
                    isOff={micMuted}
                    onClick={onToggleMic}
                    onIcon={<Mic className="size-5" />}
                    offIcon={<MicOff className="size-5" />}
                    title={micMuted ? "Unmute Mic" : "Mute Mic"}
                />

                <ControlButton
                    isOff={cameraOff}
                    onClick={onToggleCamera}
                    onIcon={<Video className="size-5" />}
                    offIcon={<VideoOff className="size-5" />}
                    title={cameraOff ? "Turn Camera On" : "Turn Camera Off"}
                />

                <button
                    type="button"
                    onClick={onToggleChat}
                    className={`size-12 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer active:scale-95 ${
                        showChat
                            ? "border-blue-500/30 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                            : "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white"
                    }`}
                    title={showChat ? "Hide Chat" : "Show Chat"}
                >
                    <MessageSquare className="size-5" />
                </button>

                <div className="h-6 w-px bg-slate-800 mx-1" />

                <Button
                    type="button"
                    onClick={onEndCall}
                    className="bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs md:text-sm font-bold px-6 h-12 rounded-xl transition-all shadow-[0_4px_14px_rgba(244,63,94,0.3)] active:scale-95 flex items-center gap-2"
                >
                    <PhoneOff className="size-4" />
                    End consultation
                </Button>
            </div>
        </div>
    );
}