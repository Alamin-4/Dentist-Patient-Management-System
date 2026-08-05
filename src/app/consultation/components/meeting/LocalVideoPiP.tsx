import { VideoTrack } from "@livekit/components-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LocalVideoPiPProps {
    track: any;
    cameraOff: boolean;
    avatar: string;
    isPatient: boolean;
}

export function LocalVideoPiP({ track, cameraOff, avatar }: LocalVideoPiPProps) {
    return (
        <div className="absolute bottom-4 right-4 w-32 sm:w-44 md:w-52 rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shadow-xl transition-all duration-300">
            <div className="relative aspect-video w-full bg-slate-900">
                {track && !cameraOff ? (
                    <VideoTrack trackRef={track} className="w-full h-full object-contain" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#13192B] p-2 text-center">
                        <Avatar className="size-10 sm:size-12 border border-slate-700">
                            <AvatarImage src={avatar} alt="You" />
                            <AvatarFallback className="bg-slate-800 text-xs font-semibold text-white">
                                YOU
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-slate-500 mt-1.5 font-medium">Camera off</span>
                    </div>
                )}
                <div className="absolute bottom-3 left-3 rounded-full bg-white px-3.5 py-1 text-[10px] font-bold text-slate-850 shadow-sm backdrop-blur-sm z-10">
                    You
                </div>
            </div>
        </div>
    );
}