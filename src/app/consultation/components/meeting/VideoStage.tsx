import { RemoteVideoView } from "./RemoteVideoView";
import { LocalVideoPiP } from "./LocalVideoPiP";

interface VideoStageProps {
    remoteCameraTrack: any;
    localCameraTrack: any;
    cameraOff: boolean;
    otherParticipantName: string;
    otherParticipantAvatar: string;
    localUserAvatar: string;
    isPatient: boolean;
    isRemoteConnected?: boolean;
}

export function VideoStage({
    remoteCameraTrack,
    localCameraTrack,
    cameraOff,
    otherParticipantName,
    otherParticipantAvatar,
    localUserAvatar,
    isPatient,
    isRemoteConnected = false,
}: VideoStageProps) {
    return (
        <div className="relative flex-1 min-h-0 w-full rounded-2xl md:rounded-[24px] border border-slate-100 bg-[#0E1322] overflow-hidden shadow-md">
            <RemoteVideoView
                track={remoteCameraTrack}
                name={otherParticipantName}
                avatar={otherParticipantAvatar}
                isRemoteConnected={isRemoteConnected}
            />

            <LocalVideoPiP
                track={localCameraTrack}
                cameraOff={cameraOff}
                avatar={localUserAvatar}
                isPatient={isPatient}
            />
        </div>
    );
}