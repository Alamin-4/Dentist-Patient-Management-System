import { VideoTrack } from "@livekit/components-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface LocalVideoPiPProps {
    track: any;
    cameraOff: boolean;
    isPatient: boolean;
}

export function LocalVideoPiP({ track, cameraOff, isPatient }: LocalVideoPiPProps) {
    return (
        <div className="absolute bottom-4 right-4 w-32 sm:w-44 md:w-52 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300">
            <div className="relative aspect-video w-full bg-slate-900">
                {track && !cameraOff ? (
                    <VideoTrack trackRef={track} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#13192B] p-2 text-center">
                        <Avatar className="size-10 sm:size-12 border border-slate-700">
                            <AvatarImage src={isPatient ? "https://i.pravatar.cc/200?img=12" : "/images/dentist.png"} alt="You" />
                            <AvatarFallback className="bg-slate-800 text-xs font-semibold text-white">
                                YOU
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-slate-500 mt-1.5 font-medium">Camera off</span>
                    </div>
                )}
                <div className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[9px] font-semibold text-slate-200 backdrop-blur-sm border border-slate-800">
                    You
                </div>
            </div>
        </div>
    );
}