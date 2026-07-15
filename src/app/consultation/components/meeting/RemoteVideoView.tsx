import { VideoTrack } from "@livekit/components-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface RemoteVideoViewProps {
    track: any; // Replace with LiveKit TrackReference type if needed
    name: string;
    avatar: string;
    isRemoteConnected?: boolean;
}

export function RemoteVideoView({ track, name, avatar, isRemoteConnected = false }: RemoteVideoViewProps) {
    const isMuted = !track || track.publication?.isMuted;
    const isCameraOff = isRemoteConnected || (track && track.publication?.isMuted);

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {!isMuted ? (
                <VideoTrack trackRef={track} className="w-full h-full object-contain" />
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 size-24 rounded-full bg-slate-800/20 animate-pulse" />
                        <Avatar className="size-24 border-2 border-slate-700 shadow-xl">
                            <AvatarImage src={avatar} alt={name} className="object-cover" />
                            <AvatarFallback className="bg-slate-800 text-lg font-bold text-white">
                                {name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-slate-200">{name}</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                            {isCameraOff 
                                ? "Camera is turned off" 
                                : "Waiting for the other participant to join the room..."}
                        </p>
                    </div>
                </div>
            )}

            <div className="absolute left-4 bottom-4 rounded-full bg-white px-4.5 py-2 text-slate-850 text-xs font-bold shadow-md border border-slate-200/55 backdrop-blur-sm z-10">
                {name}
            </div>
        </div>
    );
}