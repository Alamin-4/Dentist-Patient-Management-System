"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTracks, useLocalParticipant, useRoomContext, RoomAudioRenderer } from "@livekit/components-react";
import { Track } from "livekit-client";
import toast from "react-hot-toast";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";

import { SessionHeader } from "./SessionHeader";
import { VideoStage } from "./VideoStage";
import { ControlToolbar } from "./ControlToolbar";

interface SessionProps {
    consultation: any;
    slug: string;
    userId: string;
}

export function ConsultationVideoSession({ consultation, slug, userId }: SessionProps) {
    const router = useRouter();
    const room = useRoomContext();
    const { localParticipant } = useLocalParticipant();

    const [micMuted, setMicMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const isEndingRef = useRef(false);

    const tracks = useTracks(
        [{ source: Track.Source.Camera, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    const localCameraTrack = tracks.find((t) => t.participant.isLocal && t.source === Track.Source.Camera);
    const remoteCameraTrack = tracks.find((t) => !t.participant.isLocal && t.source === Track.Source.Camera);

    const isPatient = consultation?.patient?.userId === userId;
    const otherParticipantName = isPatient
        ? (consultation?.dentist?.user?.name ? `Dr. ${consultation.dentist.user.name}` : "Dentist")
        : (consultation?.intake ? `${consultation.intake.firstName} ${consultation.intake.lastName}` : "Patient");

    const otherParticipantAvatar = isPatient
        ? (consultation?.dentist?.user?.image || "/images/dentist.png")
        : "https://i.pravatar.cc/200?img=12";

    useEffect(() => {
        if (!consultation?.scheduledDate) return;

        const scheduledDate = new Date(consultation.scheduledDate);
        const durationMin = consultation.durationMinutes || 15;
        const endMs = scheduledDate.getTime() + durationMin * 60 * 1000;

        const updateTimer = () => {
            const remainingMs = endMs - Date.now();
            if (remainingMs <= 0) {
                setTimeLeft(0);
                handleEndCall(true);
            } else {
                setTimeLeft(Math.floor(remainingMs / 1000));
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [consultation]);

    const handleEndCall = async (autoExpire = false) => {
        if (isEndingRef.current) return;
        isEndingRef.current = true;

        try {
            if (room) room.disconnect();
            await api.patch(endpoints.consultations.updateStatus(slug), { requestStatus: "COMPLETED" });

            if (autoExpire) {
                toast.success("Meeting ended automatically after 15 minutes.");
            } else {
                toast.success("Consultation session ended.");
            }
        } catch (err) {
            console.error("Error finalizing consultation:", err);
        } finally {
            router.push(`/consultation/${slug}/complete`);
        }
    };

    const toggleMic = async () => {
        if (!localParticipant) return;
        const nextState = !micMuted;
        await localParticipant.setMicrophoneEnabled(!nextState);
        setMicMuted(nextState);
    };

    const toggleCamera = async () => {
        if (!localParticipant) return;
        const nextState = !cameraOff;
        await localParticipant.setCameraEnabled(!nextState);
        setCameraOff(nextState);
    };

    const isLowTime = timeLeft < 120 && timeLeft > 0;

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-6 overflow-hidden">
            <SessionHeader
                otherParticipantName={otherParticipantName}
                timeLeft={timeLeft}
                isLowTime={isLowTime}
            />

            <div className="flex-1 min-h-0 py-4 flex flex-col justify-between relative">
                <VideoStage
                    remoteCameraTrack={remoteCameraTrack}
                    localCameraTrack={localCameraTrack}
                    cameraOff={cameraOff}
                    otherParticipantName={otherParticipantName}
                    otherParticipantAvatar={otherParticipantAvatar}
                    isPatient={isPatient}
                />

                <RoomAudioRenderer />

                <ControlToolbar
                    micMuted={micMuted}
                    cameraOff={cameraOff}
                    onToggleMic={toggleMic}
                    onToggleCamera={toggleCamera}
                    onEndCall={() => handleEndCall(false)}
                />
            </div>
        </div>
    );
}