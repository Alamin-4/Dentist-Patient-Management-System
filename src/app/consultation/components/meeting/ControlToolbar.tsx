import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ControlButton } from "./ControlButton";

interface ControlToolbarProps {
    micMuted: boolean;
    cameraOff: boolean;
    onToggleMic: () => void;
    onToggleCamera: () => void;
    onEndCall: () => void;
}

export function ControlToolbar({ micMuted, cameraOff, onToggleMic, onToggleCamera, onEndCall }: ControlToolbarProps) {
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