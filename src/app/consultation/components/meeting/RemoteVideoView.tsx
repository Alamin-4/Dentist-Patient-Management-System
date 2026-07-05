import { VideoTrack } from "@livekit/components-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface RemoteVideoViewProps {
    track: any; // Replace with LiveKit TrackReference type if needed
    name: string;
    avatar: string;
}

export function RemoteVideoView({ track, name, avatar }: RemoteVideoViewProps) {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {track ? (
                <VideoTrack trackRef={track} className="w-full h-full object-cover" />
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 size-20 rounded-full bg-blue-500/10 animate-ping" />
                        <Avatar className="size-20 border-2 border-slate-700 shadow-xl">
                            <AvatarImage src={avatar} alt={name} />
                            <AvatarFallback className="bg-slate-800 text-lg font-bold text-white">
                                {name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div>
                        <h3 className="text-md font-semibold text-slate-200">{name}</h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                            Waiting for the other participant to join the room...
                        </p>
                    </div>
                </div>
            )}

            <div className="absolute left-4 top-4 rounded-xl bg-slate-900/90 text-slate-100 text-xs font-semibold px-3 py-1.5 backdrop-blur-md border border-slate-800 shadow-md">
                {name}
            </div>
        </div>
    );
}