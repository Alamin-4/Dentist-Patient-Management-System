"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useTracks, useLocalParticipant, useRoomContext, RoomAudioRenderer, useRemoteParticipants } from "@livekit/components-react";
import { Track } from "livekit-client";
import toast from "react-hot-toast";
import { api } from "@/api/axios.instance";
import { endpoints } from "@/api/endpoints";
import { useConsultationChat } from "@/hooks/consultation/useConsultationChat";

import { SessionHeader } from "./SessionHeader";
import { VideoStage } from "./VideoStage";
import { ControlToolbar } from "./ControlToolbar";
import { ConsultationChat } from "./ConsultationChat";

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
    const [showChat, setShowChat] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [showCompletedModal, setShowCompletedModal] = useState(false);

    const { messages, loading, isTyping, unreadCount, sendMessage, sendTyping, recipientStatus } =
        useConsultationChat(consultation.id, userId, showChat);
    const isEndingRef = useRef(false);

    const [hasMic, setHasMic] = useState(true);
    const [hasCam, setHasCam] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;

        const checkDevices = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const micAvailable = devices.some(d => d.kind === "audioinput");
                const camAvailable = devices.some(d => d.kind === "videoinput");
                setHasMic(micAvailable);
                setHasCam(camAvailable);
            } catch (err) {
                console.error("Error enumerating devices:", err);
            }
        };

        checkDevices();
        navigator.mediaDevices.addEventListener("devicechange", checkDevices);
        return () => {
            navigator.mediaDevices.removeEventListener("devicechange", checkDevices);
        };
    }, []);

    const tracks = useTracks(
        [{ source: Track.Source.Camera, withPlaceholder: false }],
        { onlySubscribed: false }
    );

    const localCameraTrack = tracks.find((t) => t.participant.isLocal && t.source === Track.Source.Camera);
    const remoteCameraTrack = tracks.find((t) => !t.participant.isLocal && t.source === Track.Source.Camera);

    const remoteParticipants = useRemoteParticipants();
    const isRemoteConnected = remoteParticipants.length > 0;

    const isPatient = consultation?.patient?.userId === userId;
    const otherParticipantName = isPatient
        ? (consultation?.dentist?.user?.name ? `Dr. ${consultation.dentist.user.name}` : "Dentist")
        : (consultation?.intake ? `${consultation.intake.firstName} ${consultation.intake.lastName}` : "Patient");

    const otherParticipantAvatar = isPatient
        ? (consultation?.dentist?.user?.image || consultation?.dentist?.dentistDirectory?.image || consultation?.directoryEntry?.image || "/images/dentist.png")
        : (consultation?.patient?.user?.image || "/images/man-avatar.png");

    const localUserAvatar = isPatient
        ? (consultation?.patient?.user?.image || "/images/man-avatar.png")
        : (consultation?.dentist?.user?.image || consultation?.dentist?.dentistDirectory?.image || consultation?.directoryEntry?.image || "/images/dentist.png");

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

    // Poll consultation status to auto-redirect patient when doctor ends meeting
    useEffect(() => {
        if (!isPatient) return;

        const interval = setInterval(async () => {
            try {
                const res = await api.get(endpoints.consultations.byId(slug));
                const data = res.data?.data;
                if (data?.requestStatus === "COMPLETED") {
                    clearInterval(interval);
                    if (!isEndingRef.current) {
                        isEndingRef.current = true;
                        toast.success("Consultation completed by your dentist.");
                        router.push(`/consultation/${slug}/complete`);
                    }
                }
            } catch (err) {
                console.error("Error polling consultation status:", err);
            }
        }, 4000); // Check every 4 seconds for immediate reaction

        return () => clearInterval(interval);
    }, [isPatient, slug, router]);

    // Handle room disconnect event
    useEffect(() => {
        if (!room) return;

        const handleDisconnect = () => {
            if (!isEndingRef.current) {
                isEndingRef.current = true;
                if (isPatient) {
                    router.push(`/consultation/${slug}/complete`);
                } else {
                    setShowCompletedModal(true);
                }
            }
        };

        room.on("disconnected", handleDisconnect);
        return () => {
            room.off("disconnected", handleDisconnect);
        };
    }, [room, slug, router, isPatient]);

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
            if (isPatient) {
                router.push(`/consultation/${slug}/complete`);
            } else {
                setShowCompletedModal(true);
            }
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
        <div className="flex flex-col h-full w-full bg-[#F8FAFB] text-slate-800 p-2 sm:p-4 md:p-6 overflow-hidden">
            <div className="w-full flex-1 flex flex-col min-h-0">
                <SessionHeader
                    otherParticipantName={otherParticipantName}
                    timeLeft={timeLeft}
                    isLowTime={isLowTime}
                />

                <div className="flex-1 min-h-0 py-4 flex gap-4 relative overflow-hidden">
                    <div className="flex-1 flex flex-col justify-between min-h-0 min-w-0 relative">
                        <VideoStage
                            remoteCameraTrack={remoteCameraTrack}
                            localCameraTrack={localCameraTrack}
                            cameraOff={cameraOff}
                            otherParticipantName={otherParticipantName}
                            otherParticipantAvatar={otherParticipantAvatar}
                            localUserAvatar={localUserAvatar}
                            isPatient={isPatient}
                            isRemoteConnected={isRemoteConnected}
                        />

                        <RoomAudioRenderer />

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                            <ControlToolbar
                                micMuted={micMuted}
                                cameraOff={cameraOff}
                                showChat={showChat}
                                unreadCount={unreadCount}
                                onToggleMic={toggleMic}
                                onToggleCamera={toggleCamera}
                                onToggleChat={() => setShowChat(!showChat)}
                                onEndCall={() => handleEndCall(false)}
                                isMicDisabled={!hasMic}
                                isCameraDisabled={!hasCam}
                            />
                        </div>
                    </div>

                    {showChat && (
                        <div className="w-80 md:w-96 flex-none rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-2xl h-full flex flex-col">
                            <ConsultationChat
                                consultationId={consultation.id}
                                currentUserId={userId}
                                recipientName={otherParticipantName}
                                recipientAvatar={otherParticipantAvatar}
                                onClose={() => setShowChat(false)}
                                theme="light"
                                messages={messages}
                                loading={loading}
                                isTyping={isTyping}
                                sendMessage={sendMessage}
                                sendTyping={sendTyping}
                                recipientStatus={recipientStatus}
                            />
                        </div>
                    )}
                </div>
            </div>

            {showCompletedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl max-w-md w-full mx-4 flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="size-20 rounded-full bg-[#113254] flex items-center justify-center shadow-lg shadow-[#113254]/10">
                            <Check className="size-10 text-white stroke-[3px]" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-[22px] md:text-[24px] font-extrabold text-text leading-tight">
                                Consultation has been completed.
                            </h2>
                            <p className="text-[14px] text-gray-500 leading-relaxed max-w-sm">
                                Now, you can move forward with creating the treatment plan based on the consultation details.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push(`/dentist/consultations?tab=Treatment Estimate&createPlanFor=${consultation.id}`)}
                            className="w-full py-3.5 bg-[#113254] hover:bg-[#0d2844] text-white font-bold text-[15px] rounded-lg active:scale-[0.98] transition-all cursor-pointer"
                        >
                            Create Treatment Plan
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}