import { RemoteVideoView } from "./RemoteVideoView";
import { LocalVideoPiP } from "./LocalVideoPiP";

interface VideoStageProps {
    remoteCameraTrack: any;
    localCameraTrack: any;
    cameraOff: boolean;
    otherParticipantName: string;
    otherParticipantAvatar: string;
    isPatient: boolean;
}

export function VideoStage({
    remoteCameraTrack,
    localCameraTrack,
    cameraOff,
    otherParticipantName,
    otherParticipantAvatar,
    isPatient,
}: VideoStageProps) {
    return (
        <div className="relative flex-1 min-h-0 w-full rounded-2xl border border-slate-800 bg-[#0E1322] overflow-hidden shadow-2xl">
            <RemoteVideoView
                track={remoteCameraTrack}
                name={otherParticipantName}
                avatar={otherParticipantAvatar}
            />

            <LocalVideoPiP
                track={localCameraTrack}
                cameraOff={cameraOff}
                isPatient={isPatient}
            />
        </div>
    );
}